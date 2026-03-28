import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SistemasIO() {
  return (
    <PageContainer
      title="Sistemas de Entrada e Saída"
      subtitle="Como a CPU se comunica com o mundo externo — teclados, monitores, redes e muito mais."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <h2>A Importância do I/O</h2>
      <p>
        Um computador sem I/O seria inútil — não poderia receber dados do usuário nem exibir resultados. O subsistema de I/O conecta a CPU ao mundo externo: dispositivos de entrada (teclado, mouse, câmera), saída (monitor, impressora, áudio) e armazenamento (SSD, HDD).
      </p>
      <p>
        O desafio central é a enorme diferença de velocidade: a CPU opera a nanosegundos, enquanto dispositivos de I/O operam a milissegundos (ou muito mais lentos). O hardware de I/O deve gerenciar essa disparidade sem paralisar a CPU.
      </p>

      <h2>Técnicas de Transferência de I/O</h2>
      <div className="not-prose space-y-4 my-8">
        {[
          {
            name: "1. Polling (Busy-Wait)",
            desc: "A CPU verifica constantemente o status do dispositivo em loop, desperdiçando ciclos enquanto o dispositivo não está pronto.",
            code: "while (device.status != READY) {}  // busy-waiting\ndevice.data = data_to_send;",
            pro: "Simples de implementar, baixa latência quando dispositivo é rápido",
            con: "Desperdiça 100% da CPU. Inaceitável para dispositivos lentos.",
            color: "border-red-500/30 bg-red-500/5",
          },
          {
            name: "2. Interrupções (Interrupt-Driven I/O)",
            desc: "A CPU inicia a operação de I/O e continua executando outras tarefas. O dispositivo envia uma interrupção quando termina, e a CPU trata o resultado.",
            code: "start_io_operation(device, buffer);\n// CPU executa outras tarefas...\n// Quando dispositivo termina: IRQ → ISR chamada",
            pro: "CPU livre para trabalhar enquanto I/O ocorre",
            con: "Overhead de interrupção para cada dado. Ruim para alta largura de banda.",
            color: "border-yellow-500/30 bg-yellow-500/5",
          },
          {
            name: "3. DMA (Direct Memory Access)",
            desc: "O controlador DMA gerencia a transferência diretamente entre o dispositivo e a memória, sem envolver a CPU a cada byte. A CPU só é avisada quando toda a transferência termina.",
            code: "dma_setup(src=disk, dst=buffer, len=4096);\ndma_start();  // CPU livre!\n// IRQ só ao final: 4096 bytes transferidos.",
            pro: "CPU livre durante toda a transferência. Essencial para alta largura de banda.",
            con: "Hardware DMA dedicado necessário. Sincronização de cache.",
            color: "border-green-500/30 bg-green-500/5",
          },
          {
            name: "4. Memória Mapeada em I/O (MMIO)",
            desc: "Registradores de dispositivos de I/O são mapeados no espaço de endereçamento de memória. A CPU acessa o dispositivo usando instruções normais de LOAD/STORE.",
            code: "// GPU MMIO example:\n#define GPU_STATUS  0xFE000000UL\n#define GPU_CMD     0xFE000004UL\n*(volatile uint32_t*)GPU_STATUS  // lê status\n*(volatile uint32_t*)GPU_CMD = CMD_DRAW;  // envia comando",
            pro: "Usa o mesmo mecanismo de memória virtual. Universal em CPUs modernas.",
            con: "Ocupa espaço do endereçamento virtual. Cuidado com caching (uncached/write-combining).",
            color: "border-cyan-500/30 bg-cyan-500/5",
          },
        ].map(t => (
          <div key={t.name} className={`border rounded-xl p-5 ${t.color}`}>
            <h3 className="font-bold text-foreground mb-2">{t.name}</h3>
            <p className="text-sm text-foreground/80 mb-3">{t.desc}</p>
            <pre className="bg-black/30 rounded-lg px-3 py-2 font-mono text-xs text-green-300 mb-3 overflow-x-auto">{t.code}</pre>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-500/10 rounded-lg p-2">
                <p className="text-xs font-bold text-green-400 mb-0.5">✓</p>
                <p className="text-xs text-muted-foreground">{t.pro}</p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-2">
                <p className="text-xs font-bold text-red-400 mb-0.5">✗</p>
                <p className="text-xs text-muted-foreground">{t.con}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2>Dispositivos de I/O por Categoria</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { cat: "Entrada", devs: "Teclado, mouse, touchscreen, câmera, microfone, scanner, gamepad, sensor de impressão digital" },
          { cat: "Saída", devs: "Monitor (HDMI/DP/USB-C), impressora, alto-falante, DAC de áudio, projetor" },
          { cat: "Armazenamento", devs: "SSD NVMe, HDD, USB flash, SD Card, fita magnética (backup), CD/DVD (legado)" },
          { cat: "Rede e Comunicação", devs: "NIC Ethernet, Wi-Fi adapter, Bluetooth, modem 5G/LTE, USB, Thunderbolt, HDMI CEC" },
        ].map(c => (
          <div key={c.cat} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-2">{c.cat}</h3>
            <p className="text-xs text-muted-foreground">{c.devs}</p>
          </div>
        ))}
      </div>

      <h2>IOMMU — Gerenciamento de Memória para I/O</h2>
      <p>
        O IOMMU (Input/Output Memory Management Unit) aplica virtualização e proteção ao DMA, impedindo que dispositivos maliciosos ou com bug acessem memória arbitrária:
      </p>
      <CodeBlock language="text" title="IOMMU e segurança de DMA" code={`
Sem IOMMU:
  Dispositivo PCIe pode ler/escrever qualquer endereço físico!
  → Ataque "DMA attack": pen drive malicioso acessa senhas na RAM

Com IOMMU (Intel VT-d / AMD-Vi):
  Cada dispositivo tem seu próprio espaço de endereçamento de I/O
  Tabela de páginas de I/O definida pelo SO
  DMA fora do mapeamento → fault, acesso bloqueado

Usos do IOMMU:
  ✓ Segurança: previne ataques de DMA (Thunderbolt, USB-C DP Alt)
  ✓ Virtualização: GPU passthrough (VFIO no Linux/KVM)
  ✓ Isolamento: containers de hardware (SR-IOV)
      `} />

      <AlertBox type="info" title="I/O no Linux: tudo é arquivo">
        No Linux, dispositivos de I/O são acessados através de arquivos especiais em /dev: /dev/sda (disco), /dev/input/event0 (teclado), /dev/video0 (câmera). Esta abstração elegante permite usar ferramentas padrão (cat, dd, read()) para interagir com qualquer dispositivo.
      </AlertBox>
    </PageContainer>
  );
}
