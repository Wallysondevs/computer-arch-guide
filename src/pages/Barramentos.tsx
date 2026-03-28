import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Barramentos() {
  return (
    <PageContainer
      title="Barramentos (PCIe, USB e outros)"
      subtitle="Os protocolos que conectam CPU, memória e dispositivos — de PCIe 5.0 a USB4 e Thunderbolt."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <h2>O que é um Barramento?</h2>
      <p>
        Um barramento é um sistema de comunicação compartilhado que transfere dados entre componentes. Os barramentos definem o protocolo físico (voltagem, timing), o protocolo lógico (formato de pacotes, camadas), e a topologia (como os dispositivos se conectam).
      </p>

      <h2>PCIe — PCI Express</h2>
      <p>
        PCIe é o barramento dominante para periféricos de alta performance: GPUs, SSDs NVMe, NICs de 100GbE. Usa enlaces seriais ponto-a-ponto (não compartilhado) organizados em lanes (×1, ×2, ×4, ×8, ×16):
      </p>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="border border-border px-3 py-2 text-left">Versão</th>
              <th className="border border-border px-3 py-2 text-right">Freq.</th>
              <th className="border border-border px-3 py-2 text-right">BW/lane</th>
              <th className="border border-border px-3 py-2 text-right">BW ×16</th>
              <th className="border border-border px-3 py-2 text-left">Disponível desde</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["PCIe 3.0", "8 GT/s", "~985 MB/s", "~15,7 GB/s", "2010"],
              ["PCIe 4.0", "16 GT/s", "~1,97 GB/s", "~31,5 GB/s", "2017 (AMD Zen 2)"],
              ["PCIe 5.0", "32 GT/s", "~3,94 GB/s", "~63 GB/s", "2022 (Intel Sapphire Rapids)"],
              ["PCIe 6.0", "64 GT/s", "~7,88 GB/s", "~126 GB/s", "2023 (enterprise)"],
              ["PCIe 7.0", "128 GT/s", "~15,76 GB/s", "~252 GB/s", "~2025 (futuro)"],
            ].map(([ver, freq, bw, bw16, year]) => (
              <tr key={ver} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 font-bold text-primary">{ver}</td>
                <td className="border border-border px-3 py-2 text-right font-mono">{freq}</td>
                <td className="border border-border px-3 py-2 text-right font-mono">{bw}</td>
                <td className="border border-border px-3 py-2 text-right font-mono">{bw16}</td>
                <td className="border border-border px-3 py-2 text-sm text-muted-foreground">{year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CodeBlock language="text" title="Topologia PCIe moderna (chipset)" code={`
CPU ←→ PCIe Root Complex
         ├── x16: GPU (direto ao CPU, máxima largura de banda)
         ├── x4:  SSD NVMe (direto ao CPU)
         └── Chipset (DMI / UPI link)
                ├── x4: SSD NVMe #2
                ├── x1: NIC Ethernet
                ├── x1: Wi-Fi 7 M.2
                └── USB, SATA, HD Audio...
      `} />

      <h2>USB — Universal Serial Bus</h2>
      <div className="not-prose space-y-3 my-6">
        {[
          { ver: "USB 2.0", speed: "480 Mbps (60 MB/s)", power: "2,5W (5V@0,5A)", note: "Suficiente para teclado, mouse, câmeras simples" },
          { ver: "USB 3.2 Gen 1 (USB-A/C)", speed: "5 Gbps (625 MB/s)", power: "4,5W (5V@0,9A)", note: "Pendrives USB-A modernos" },
          { ver: "USB 3.2 Gen 2×2", speed: "20 Gbps (2,5 GB/s)", power: "15W (5V@3A)", note: "Dual-lane, requer USB-C" },
          { ver: "USB4 Gen 2×2", speed: "20 Gbps", power: "100W (PD 3.0)", note: "Baseado em Thunderbolt 3, suporta DisplayPort e PCIe tunnel" },
          { ver: "USB4 Gen 3×2 (40 Gbps)", speed: "40 Gbps (5 GB/s)", power: "240W (PD 3.1)", note: "Mesma velocidade do Thunderbolt 4" },
        ].map(u => (
          <div key={u.ver} className="bg-card border border-border rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <h3 className="font-bold text-primary text-sm">{u.ver}</h3>
              <div className="flex gap-3 text-xs font-mono text-muted-foreground">
                <span>{u.speed}</span>
                <span>Potência: {u.power}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{u.note}</p>
          </div>
        ))}
      </div>

      <h2>Thunderbolt</h2>
      <p>
        Thunderbolt combina DisplayPort, PCIe e USB em um único conector físico (USB-C). Exige certificação especial e é mais caro, mas oferece máxima versatilidade:
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
        {[
          { ver: "Thunderbolt 3", bw: "40 Gbps", pcie: "PCIe 3.0 ×4", dp: "2× DP 1.2", power: "100W" },
          { ver: "Thunderbolt 4", bw: "40 Gbps", pcie: "PCIe 3.0 ×4", dp: "2× DP 1.4 (8K)", power: "100W" },
          { ver: "Thunderbolt 5", bw: "120 Gbps assimétrico", pcie: "PCIe 4.0 ×4", dp: "DP 2.1 (16K)", power: "240W" },
        ].map(t => (
          <div key={t.ver} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-2">{t.ver}</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Largura de banda:</span><span>{t.bw}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">PCIe tunnel:</span><span>{t.pcie}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Display:</span><span>{t.dp}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Power delivery:</span><span>{t.power}</span></div>
            </div>
          </div>
        ))}
      </div>

      <h2>Outros Barramentos Importantes</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "SATA III", bw: "6 Gbps", use: "HDDs e SSDs SATA. Legado mas ainda muito usado em desktops e NAS." },
          { name: "I²C (Inter-IC)", bw: "3,4 Mbps", use: "Sensores, EEPROM, displays, barramentos de gestão de energia na placa-mãe." },
          { name: "SPI (Serial Peripheral Interface)", bw: "50+ Mbps", use: "Flash de firmware (BIOS/UEFI), displays LCD, sensores de alta taxa." },
          { name: "UART", bw: "115200 baud", use: "Console serial de debug. Ainda usado em sistemas embarcados e placas SBC." },
          { name: "CXL (Compute Express Link)", bw: "PCIe 5.0 base", use: "Memória coerente CPU-GPU-accelerators. Futuro do HPC e IA." },
          { name: "NVLink (NVIDIA)", bw: "900 GB/s (NVLink 4)", use: "Interconexão GPU-GPU de alta largura de banda. Data centers de IA." },
        ].map(b => (
          <div key={b.name} className="bg-card border border-border rounded-xl p-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-primary text-sm">{b.name}</h3>
              <span className="text-xs font-mono text-muted-foreground">{b.bw}</span>
            </div>
            <p className="text-xs text-muted-foreground">{b.use}</p>
          </div>
        ))}
      </div>

      <AlertBox type="info" title="A convergência dos conectores">
        USB-C está se tornando o conector universal: pode transportar USB 4, Thunderbolt 5, DisplayPort 2.1, HDMI 2.1, PCIe 4.0, e carregar com até 240W. A Apple, neste sentido, foi pioneira ao adotar apenas USB-C nos MacBooks desde 2016.
      </AlertBox>
    </PageContainer>
  );
}
