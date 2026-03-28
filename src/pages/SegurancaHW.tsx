import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SegurancaHW() {
  return (
    <PageContainer
      title="Segurança em Hardware"
      subtitle="Vulnerabilidades que vivem no silício — Spectre, Meltdown, Rowhammer e as defesas do hardware moderno."
      difficulty="avancado"
      timeToRead="15 min"
    >
      <h2>Por que Segurança de Hardware Importa?</h2>
      <p>
        Vulnerabilidades de hardware são as mais difíceis de corrigir — patches de software podem mitigar, mas muitas vezes com custo de performance significativo, e a vulnerabilidade permanece no silício para sempre. Pior: ataques de hardware bypassam todas as proteções do SO e hypervisor.
      </p>

      <h2>Spectre e Meltdown (2018)</h2>
      <p>
        Descobertas por pesquisadores do Google Project Zero, Spectre e Meltdown exploraram otimizações microarquiteturais de CPUs modernas — afetando praticamente todo processador fabricado desde 1995.
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          {
            name: "Meltdown (CVE-2017-5754)",
            affect: "Intel CPUs (principalmente), alguns ARM",
            attack: "Exploita execução especulativa para ler memória do kernel a partir do userspace. Um processo normal lê a memória do SO!",
            fix: "KPTI (Kernel Page Table Isolation): separa mapeamento kernel/user. Overhead: 0-30% em workloads de I/O intenso.",
            hw: "Corrigido em hardware desde Ice Lake (Intel, 2019)",
          },
          {
            name: "Spectre (CVE-2017-5753, 5715)",
            affect: "Quase todos os CPUs (Intel, AMD, ARM)",
            attack: "Enganar execução especulativa de outras processoos (ou kernel) para vazar dados via side-channel de cache.",
            fix: "Retpoline (compilador), IBRS/IBPB/STIBP (microcode/hardware). Sem solução completa em software.",
            hw: "Mitigações parciais em hardware (eIBRS, IBRS enhanced) desde Cascade Lake.",
          },
        ].map(v => (
          <div key={v.name} className="bg-card border border-red-500/20 rounded-xl p-5">
            <h3 className="font-bold text-red-400 mb-2">{v.name}</h3>
            <p className="text-xs text-muted-foreground mb-1"><strong className="text-foreground">Afeta:</strong> {v.affect}</p>
            <p className="text-sm text-foreground/80 mb-2">{v.attack}</p>
            <p className="text-xs text-muted-foreground mb-1"><strong className="text-foreground">Mitigação SW:</strong> {v.fix}</p>
            <p className="text-xs text-green-400"><strong>HW:</strong> {v.hw}</p>
          </div>
        ))}
      </div>

      <h2>Como Funciona o Ataque Spectre</h2>
      <CodeBlock language="c" title="Gadget Spectre v1 (bounds check bypass)" code={`
// Código da vítima (ex: kernel, hypervisor):
if (untrusted_offset < array1_size) {            // bounds check
    uint8_t secret = array2[array1[untrusted_offset] * 512]; // acesso
}

// Se o preditor de branch acha que (offset < size) é TRUE:
// CPU especulativamente executa o acesso MESMO com offset inválido!
// O dado vaza para o cache (array2[secret * 512] é carregado)

// Atacante mede tempo de acesso a array2[i] para i=0..255:
for (int i = 0; i < 256; i++) {
    uint64_t time = rdtscp();
    volatile uint8_t _ = array2[i * 512];  // tenta acessar
    time = rdtscp() - time;
    if (time < THRESHOLD) {
        // CACHE HIT! secret == i → dado vaza via timing!
    }
}
      `} />

      <h2>Rowhammer</h2>
      <p>
        Rowhammer é um ataque físico à DRAM: acessar repetidamente uma linha de memória pode causar bit flips em linhas adjacentes, sem nenhum bug de software:
      </p>
      <CodeBlock language="c" title="Double-sided rowhammer" code={`
// Acessar linha ACIMA e ABAIXO da linha-alvo muito rapidamente:
void rowhammer(volatile uint8_t* row_a, volatile uint8_t* row_b) {
    for (int i = 0; i < 10000000; i++) {
        *row_a;           // acessa linha A (flush para DRAM)
        *row_b;           // acessa linha B (flush para DRAM)
        asm volatile("clflush (%0)" :: "r"(row_a));  // invalida cache
        asm volatile("clflush (%0)" :: "r"(row_b));  // invalida cache
    }
    // Após milhões de acessos: bit flip na linha entre A e B!
}

// Demonstrações reais:
// - Escalada de privilégio em Linux via bit flip em page table
// - Fuga de sandbox em VMs cloud
// - Ataque remoto via JavaScript (no browser!)
      `} />
      <p>
        Mitigações: ECC detecta e corrige bit flips. TRR (Target Row Refresh) nas DRAMs modernas. pTRR e RFM (Refresh Management) no DDR5. Mas pesquisadores continuam encontrando bypasses.
      </p>

      <h2>TPM e Secure Boot</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "TPM 2.0", desc: "Chip dedicado para armazenar chaves criptográficas, attestation de integridade do sistema, BitLocker. Obrigatório para Windows 11.", hw: "Integrado na maioria das placas-mãe modernas (fTPM em AMD/Intel)" },
          { name: "Secure Boot", desc: "UEFI verifica a assinatura criptográfica de cada componente do boot (bootloader, kernel). Impede bootkits.", hw: "Suportado por todos os UEFI modernos desde 2012" },
          { name: "Intel TDX / AMD SEV-SNP", desc: "Trusted Execution Environments para cloud: a VM é criptografada e isolada mesmo do hypervisor/host. Essencial para confidential computing.", hw: "Intel Sapphire Rapids (TDX), AMD EPYC Genoa (SEV-SNP)" },
          { name: "ARM TrustZone", desc: "Divide o processador em 'mundo seguro' e 'mundo normal'. Secure World executa TEE OS (OP-TEE, Trusty). Usado em Face ID, pagamentos NFC.", hw: "Presente em todos os ARM Cortex-A desde 2004" },
        ].map(t => (
          <div key={t.name} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{t.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{t.desc}</p>
            <p className="text-xs text-cyan-400">{t.hw}</p>
          </div>
        ))}
      </div>

      <AlertBox type="danger" title="Side-channel attacks são inevitáveis?">
        Toda otimização de hardware que vaza informação sobre o estado interno pode potencialmente ser explorada como side-channel: timing de cache, consumo de energia (DEMA/SPA), emissão eletromagnética, e até som de capacitores. O design de hardware seguro requer pensar em segurança desde o início, não como adendo.
      </AlertBox>
    </PageContainer>
  );
}
