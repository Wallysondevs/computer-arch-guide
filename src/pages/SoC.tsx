import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SoC() {
  return (
    <PageContainer
      title="SoC — System on Chip"
      subtitle="Quando CPU, GPU, memória, NPU e I/O convivem num único chip — a arquitetura que move smartphones e o futuro dos PCs."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"SoC"}</strong> {' — '} {"System on Chip — CPU+GPU+modem+ISP em um chip."}
          </li>
        <li>
            <strong>{"Vantagens"}</strong> {' — '} {"menor área, menos energia, menor latência."}
          </li>
        <li>
            <strong>{"Exemplos"}</strong> {' — '} {"Snapdragon, Apple Silicon, Tegra, Exynos."}
          </li>
        <li>
            <strong>{"Mobile-first"}</strong> {' — '} {"padrão em smartphones e tablets."}
          </li>
        <li>
            <strong>{"Desktop"}</strong> {' — '} {"Apple M1/M2 trouxe SoC ao laptop/desktop."}
          </li>
        </ul>
        <h2>O que é um SoC?</h2>
      <p>
        Um SoC (System on Chip) integra todos os componentes principais de um sistema de computação em um único chip de silício: CPU, GPU, memória controladora, NPU, codecs de vídeo, modem, controladores de I/O — tudo em um die ou em um pacote multichip.
      </p>
      <p>
        Isso contrasta com desktops tradicionais onde cada componente é um chip separado (CPU, GPU discreta, chipset, etc.). A integração reduz latência de comunicação, consumo de energia e tamanho físico drasticamente.
      </p>

      <h2>Componentes Típicos de um SoC Mobile</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "CPU (big.LITTLE)", desc: "Cluster de cores grandes (alto desempenho) + cores pequenos (eficiência). ARM DynamIQ em iPhones e Androids." },
          { name: "GPU", desc: "Gráficos 3D para jogos e UI. Apple GPU, Adreno (Qualcomm), Mali (ARM), Xclipse (Samsung/AMD). LPDDR5 compartilhada." },
          { name: "NPU / DSP", desc: "Inferência de machine learning em tempo real. Face ID, HDR inteligente, reconhecimento de voz offline." },
          { name: "ISP (Image Signal Processor)", desc: "Processa dados brutos do sensor de câmera em tempo real: denoising, HDR, demosaicing, AF. Centenas de TOPS." },
          { name: "Codecs de Vídeo", desc: "H.264, H.265 (HEVC), AV1, VP9: encode e decode por hardware. Sem isso, 4K60 drenaria a bateria rapidamente." },
          { name: "Modem e Conectividade", desc: "5G Sub-6/mmWave, Wi-Fi 7, Bluetooth 5.4, UWB. Qualcomm Snapdragon X70/80 modem embutido." },
          { name: "Controladora de Memória", desc: "Interface LPDDR5x para RAM e UFS 4.0 para armazenamento interno — ambas integradas no die." },
          { name: "Security Enclave", desc: "Chip seguro para chaves criptográficas, Face ID, Apple Pay. Isolado do resto do SoC por hardware." },
        ].map(c => (
          <div key={c.name} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{c.name}</h3>
            <p className="text-sm text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </div>

      <h2>Apple A17 Pro — Anatomia Detalhada</h2>
      <CodeBlock language="text" title="Apple A17 Pro (iPhone 15 Pro)" code={`
Processo: TSMC 3nm (N3B)
Transistores: 19 bilhões
Área: ~77 mm²

CPU:
  2× P-cores "Everest" a ~3,78 GHz (alto desempenho)
  4× E-cores "Sawtooth" a ~2,11 GHz (eficiência)
  L1: 192 KB I + 128 KB D (P-core)
  L2 shared cluster: 16 MB

GPU:
  6-core GPU Apple (hardware ray tracing 1ª geração!)
  Suporte: Metal 3, Mesh Shaders
  
Neural Engine (ANE):
  16-core NPU: 35 TOPS

ISP (Image Signal Processor):
  4K 60fps ProRes, ProRes RAW capture, Log video

Memória:
  LPDDR5 unificada: 6 GB @ 68,3 GB/s

Armazenamento:
  UFS 3.1 interna (integrada, não removível)

Conectividade (pacote separado mas no mesmo módulo):
  5G Qualcomm X70, Wi-Fi 6E, Bluetooth 5.3, Ultra-Wideband

Performance (Geekbench 6):
  Single-core: ~2.900 (vs Intel Core i9-14900K: ~3.100)
  Multi-core: ~7.200 (vs Intel Core i9-14900K: ~21.000 com 24 cores)
  Performance/Watt: 2-3× superior ao i9-14900K!
      `} />

      <h2>Arquitetura Multichip (Chiplet)</h2>
      <p>
        Chips modernos ultragrandes são fabricados como múltiplos chiplets menores (dies), interconectados em um único pacote. Isso aumenta o yield de fabricação e permite misturar nós de processo diferentes:
      </p>
      <CodeBlock language="text" title="Apple M4 Ultra — arquitetura multichip" code={`
M4 Ultra = 2× M4 Max interconectados via UltraFusion
(Die-to-die interconnect com 22,4 GB/s de largura de banda)

Cada M4 Max:
  CPU: 12 cores (4P + 8E)
  GPU: 40 cores
  NPU: 38 TOPS
  Memória: 64-128 GB LPDDR5X, 546 GB/s

M4 Ultra:
  CPU: 24 cores (8P + 16E)
  GPU: 80 cores
  NPU: 76 TOPS
  Memória: 128-192 GB LPDDR5X, 819 GB/s
  
O UltraFusion faz os 2 dies parecerem 1 para o software.
Nenhum overhead de protocolo PCIe — coerência de cache nativa!
      `} />

      <AlertBox type="success" title="SoC e o futuro do PC">
        A Apple Silicon demonstrou que a integração extrema de SoC derrota a abordagem discreta em eficiência. AMD com Strix Point (Ryzen AI 300) e Qualcomm com Snapdragon X Elite estão trazendo essa filosofia para Windows. Intel responde com o Lunar Lake (2024), que integra memória LPDDR5x diretamente no pacote do processador — assim como smartphones há anos.
      </AlertBox>
    </PageContainer>
  );
}
