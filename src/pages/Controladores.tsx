import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Controladores() {
  return (
    <PageContainer
      title="Controladores e Periféricos"
      subtitle="Como os controladores de hardware traduzem protocolos de barramento em operações de dispositivo."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <h2>O que é um Controlador?</h2>
      <p>
        Um controlador de hardware (device controller) é um circuito intermediário entre o barramento do sistema e o dispositivo físico. Ele traduz os comandos de alto nível do SO em sinais elétricos específicos do dispositivo, e vice-versa.
      </p>

      <h2>Controladores Comuns</h2>
      <div className="not-prose space-y-4 my-8">
        {[
          {
            name: "NVMe Controller (SSD)",
            desc: "Implementa o protocolo NVMe sobre PCIe. Gerencia múltiplas filas de comandos (até 65.535 filas!), execução em paralelo, FTL, wear leveling, e compressão de dados.",
            hw: "Phison E18, Silicon Motion SM2267, Samsung Elpis",
          },
          {
            name: "GPU (Graphics Processing Unit)",
            desc: "O maior e mais complexo 'controlador' de sistema. Processa streams de vértices e pixels, executa shaders, gerencia memória de vídeo (VRAM), e produz frames para o display via HDMI/DP.",
            hw: "NVIDIA AD102 (RTX 4090), AMD Navi 31 (RX 7900 XTX)",
          },
          {
            name: "NIC (Network Interface Controller)",
            desc: "Implementa os protocolos de rede (Ethernet, Wi-Fi) em hardware. Inclui MAC (Media Access Control), PHY (physical layer), buffers de RX/TX, e offload de TCP/IP.",
            hw: "Intel I225-V (2,5GbE), Realtek RTL8125, Marvell AQC113",
          },
          {
            name: "Controlador USB Host (xHCI)",
            desc: "Gerencia todos os dispositivos USB conectados. xHCI (extensible Host Controller Interface) suporta USB 3.x e USB 2.0 simultâneos. Usa slots de dispositivo e rings de transferência.",
            hw: "Integrado em chipsets Intel/AMD. Chip discreto ASMedia ASM2142.",
          },
          {
            name: "SATA Controller (AHCI/RAID)",
            desc: "Implementa AHCI (Advanced Host Controller Interface) para SSDs e HDDs SATA. Suporta NCQ (Native Command Queuing) para reordenar comandos e maximizar performance.",
            hw: "Integrado em chipsets modernos. Chips discretos Marvell 9235.",
          },
          {
            name: "Audio Controller (HDA)",
            desc: "Intel High Definition Audio: barramento de áudio digital com suporte a múltiplos codecs. Inclui conversores DAC/ADC, mixagem de streams, e controle de volume por hardware.",
            hw: "Realtek ALC897/ALC4080/ALC4082 (placas-mãe consumer).",
          },
        ].map(c => (
          <div key={c.name} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold text-primary mb-2">{c.name}</h3>
            <p className="text-sm text-foreground/80 mb-2">{c.desc}</p>
            <p className="text-xs text-muted-foreground"><strong>Exemplos reais:</strong> {c.hw}</p>
          </div>
        ))}
      </div>

      <h2>Drivers de Dispositivo</h2>
      <p>
        O driver é o software que o SO usa para interagir com o controlador. Ele traduz as operações do SO (read/write de arquivos) em comandos específicos do hardware:
      </p>
      <CodeBlock language="text" title="Camadas de software para I/O de disco" code={`
Aplicação:         read(fd, buffer, 4096)
                         ↓
VFS:               vfs_read() → ext4 filesystem
                         ↓
Block Layer:       request queue, I/O scheduler (mq-deadline, kyber)
                         ↓
NVMe Driver:       nvme_submit_cmd() → constrói SQE (Submission Queue Entry)
                         ↓
Hardware:          DMA → NVMe controller → NAND Flash
                         ↓ (IRQ quando completo)
NVMe Driver:       nvme_complete_cmd() → CQE processado
                         ↓
Block Layer:       bio_endio() → marca I/O completo
                         ↓
VFS:               retorna dados ao usuário
      `} />

      <h2>Controladores em SoC</h2>
      <p>
        Em SoCs (System on Chip) — encontrados em smartphones, tablets e ARM servers — os controladores são integrados diretamente no die do processador:
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "Apple A17 Pro", iface: "USB 3.2, PCIe 4.0 (para storage interno), LPDDR5X controller, Display Engine, Neural Engine, ISP (câmera)" },
          { name: "Qualcomm Snapdragon 8 Gen 3", iface: "USB4, WiFi 7 (Qualcomm FastConnect 7800), Bluetooth 5.4, Adreno GPU, Hexagon NPU, Spectra ISP" },
          { name: "AMD Ryzen AI 300 (Strix Point)", iface: "DDR5/LPDDR5x controller, PCIe 5.0, USB 4, Radeon 890M GPU, XDNA3 NPU (50 TOPS)" },
          { name: "NVIDIA Orin (Jetson)", iface: "LPDDR5x, PCIe 5.0, Ethernet 10GbE, NVENC/NVDEC, GPU ampere 2048 CUDA cores, NVLink" },
        ].map(s => (
          <div key={s.name} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-2">{s.name}</h3>
            <p className="text-xs text-muted-foreground">{s.iface}</p>
          </div>
        ))}
      </div>

      <AlertBox type="success" title="Controladores e open-source">
        O Linux suporta milhares de controladores via drivers open-source na árvore do kernel. Isso é possível porque os fabricantes publicam especificações de hardware ou contribuem com drivers. Drivers proprietários (alguns GPUs, Wi-Fi) são carregados como módulos kernel externos.
      </AlertBox>

      <h2>Troubleshooting de Hardware</h2>
      <CodeBlock language="bash" title="Diagnosticando hardware no Linux" code={`
# Ver todos os dispositivos PCIe:
lspci -v

# Ver uso de IRQ e dispositivos:
cat /proc/interrupts

# Monitorar atividade DMA e I/O:
iostat -x 1    # estatísticas de I/O de disco
iotop          # processos usando mais I/O

# Ver controladores USB:
lsusb -t       # árvore de dispositivos USB

# Mensagens do kernel sobre hardware:
dmesg | grep -E "(error|fail|nvme|ahci|xhci)" | tail -50

# Teste de velocidade NVMe:
nvme smart-log /dev/nvme0
fio --rw=randread --bs=4k --numjobs=1 ...
      `} />
    </PageContainer>
  );
}
