import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function NPUTPU() {
  return (
    <PageContainer
      title="NPU e TPU (Aceleradores de IA)"
      subtitle="Os chips especializados que alimentam o boom da inteligência artificial — de smartphones a data centers."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"NPU"}</strong> {' — '} {"Neural Processing Unit — acelerador de IA em SoCs móveis."}
          </li>
        <li>
            <strong>{"TPU"}</strong> {' — '} {"Tensor Processing Unit — ASIC do Google para TensorFlow."}
          </li>
        <li>
            <strong>{"Operação central"}</strong> {' — '} {"multiplicação matriz-matriz (GEMM) e convolução."}
          </li>
        <li>
            <strong>{"Precisão reduzida"}</strong> {' — '} {"int8, fp16, bf16 economizam energia."}
          </li>
        <li>
            <strong>{"Edge AI"}</strong> {' — '} {"inferência local sem cloud."}
          </li>
        </ul>
        <h2>Por que Aceleradores de IA?</h2>
      <p>
        Redes neurais são essencialmente multiplicação de matrizes em escala massiva. Uma única forward pass de um LLM como GPT-3 (175B parâmetros) envolve trilhões de operações de multiplicação-acumulação (MAC). CPUs e GPUs de propósito geral são ineficientes para isso — NPUs e TPUs são projetados especificamente para essas operações.
      </p>

      <h2>A Operação Central: GEMM</h2>
      <CodeBlock language="text" title="GEMM — General Matrix Multiplication" code={`
C = A × B + C   (Fused Multiply-Add de matrizes)

Para uma rede neural com layer de 4096×4096:
  Operações: 2 × 4096 × 4096 × 4096 ≈ 137 bilhões de FLOPs
  
CPU (Intel Core i9, 1 thread): ~50 GFLOPS FP32 → 2,7 segundos
GPU (RTX 4090): 82.600 GFLOPS FP32 → 1,7 ms
GPU com Tensor Core (FP16): 1.321 TFLOPS → 0.1 ms
Google TPU v5p (BF16): 459 TFLOPS → 0.3 ms (mas mais eficiente!)

Aceleradores de IA otimizam:
  ✓ Tipos de dados reduzidos: INT8, INT4, FP8, BF16 (vs FP32)
  ✓ Systolic arrays: hardware dedicado a GEMM
  ✓ Memória on-chip massiva (reduz DRAM reads)
  ✓ Consumo de energia mínimo por operação
      `} />

      <h2>TPU — Tensor Processing Unit (Google)</h2>
      <CodeBlock language="text" title="Google TPU v5p (2023)" code={`
Arquitetura: Systolic Array
  Matriz de 256×256 MACs (Multiply-Accumulate Units)
  = 65.536 MACs executando simultaneamente!

Tipos de dados: BF16 (Brain Float 16), INT8
Throughput: 459 TFLOPS BF16 por chip

Memória on-chip (VMEM): 95 MB (evita idas à DRAM para ativações)
HBM2e: 96 GB, 1,6 TB/s

Topologia: 4D torus (clusters de até 8.960 chips!)
  ICI (Inter-Chip Interconnect): 1,2 TB/s bidirecion. por chip

Pod TPU v5p: 8.960 chips
  Total: 8.960 × 459 = 4,1 ExaFLOPS BF16!
  Largura de banda total: ~13 PB/s de ICI

Uso: Treinar modelos Google (Bard/Gemini)
     Disponível via Google Cloud TPU v5p
      `} />

      <h2>Systolic Array — Como Funciona</h2>
      <CodeBlock language="text" title="Systolic array 3×3 calculando produto matricial" code={`
A × B = C (cada elemento flui através do array)

Ciclo 1:  a11 →  [PE]    [PE]    [PE]
                   b11↓   b12↓   b13↓

Ciclo 2: a12 →  [PE]──▶ [PE]    [PE]
          a21 →  [PE]    [PE]    [PE]
                   psum flows right →
                   weights flow down ↓

Cada Processing Element (PE) faz: acc += A × B

Vantagem: dados fluem continuamente, sem memória externa por ciclo.
A11 * B11 → A12 * B21 → ... todos chegam no PE correto!

Eficiência máxima: quase 100% de utilização dos MACs.
Latência: n ciclos para iniciar (pipeline fill) + n ciclos por tile.
      `} />

      <h2>NPU em Dispositivos de Borda</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "Apple Neural Engine (A17 Pro)", tops: "35 TOPS", use: "Face ID, Smart HDR, Siri, tradução, Live Photo, Depth Control", power: "<2W típico" },
          { name: "Qualcomm Hexagon NPU (X Elite)", tops: "45 TOPS", use: "AI enhancement, Copilot+ PC, on-device LLM, image segmentation", power: "<5W" },
          { name: "AMD Ryzen AI 300 XDNA3", tops: "50 TOPS", use: "AMD ROCm on-device, Windows Copilot+, inferência ONNX", power: "~4W NPU" },
          { name: "Google Tensor G3 (Pixel 8 Pro)", tops: "~25 TOPS", use: "Magic Eraser, Best Take, Voice Recorder transcription, on-device Gemini Nano", power: "<1,5W" },
          { name: "Samsung Mobileye EyeQ6H", tops: "~176 TOPS", use: "ADAS e veículos autônomos — detecção de objetos em tempo real", power: "~5W" },
          { name: "Intel Gaudi 3 (HL-325L)", tops: "2.048 TOPS BF16", use: "Alternativa ao H100 para treinamento de LLMs em data centers", power: "900W" },
        ].map(n => (
          <div key={n.name} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{n.name}</h3>
            <div className="flex gap-3 text-xs mb-1">
              <span className="font-bold text-foreground">{n.tops}</span>
              <span className="text-muted-foreground">{n.power}</span>
            </div>
            <p className="text-xs text-muted-foreground">{n.use}</p>
          </div>
        ))}
      </div>

      <h2>Quantização: Chave para Eficiência</h2>
      <CodeBlock language="text" title="Quantização de modelos neurais" code={`
Pesos originais: FP32 (4 bytes) — alta precisão, alto custo

Quantização reduz precisão para economizar memória e compute:

FP16 (2 bytes): 2× menor, quase sem perda de qualidade
BF16 (2 bytes): mesma faixa do FP32, preferido em treinamento
FP8 (1 byte):   8× menor, eficiente em H100/Gaudi 3
INT8 (1 byte):  8× menor, sem ponto flutuante → máxima velocidade
INT4 (0,5 bytes): 8× menor que FP16, perda moderada de qualidade
GGUF Q4_K_M:    ~4-bit com groups, popular para LLMs no PC (llama.cpp)

Exemplo: LLaMA 3 70B
  FP16: 140 GB VRAM → precisa 2× A100 (80GB)
  INT4: 35 GB VRAM → roda em 1× A100 ou 2× RTX 4090
  Q4_K_M: ~40 GB → roda em PC com 64 GB RAM (CPU offload)
      `} />

      <AlertBox type="info" title="O futuro: modelos na borda">
        A tendência é executar modelos de IA cada vez menores diretamente no dispositivo (on-device), sem enviar dados para a nuvem. Apple Intelligence (A18), Gemini Nano no Pixel, e Windows Copilot+ demonstram que modelos de 2-7B parâmetros rodando em NPUs locais são viáveis — com privacidade e latência melhores que a nuvem.
      </AlertBox>
    </PageContainer>
  );
}
