import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GPU() {
  return (
    <PageContainer
      title="GPU e Computação Paralela"
      subtitle="Como as GPUs processam milhares de tarefas em paralelo — de gráficos a inteligência artificial."
      difficulty="avancado"
      timeToRead="16 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"GPU"}</strong> {' — '} {"Graphics Processing Unit — milhares de cores simples para paralelismo."}
          </li>
        <li>
            <strong>{"CUDA"}</strong> {' — '} {"API NVIDIA para programação paralela."}
          </li>
        <li>
            <strong>{"Shader"}</strong> {' — '} {"programa que roda em cores da GPU."}
          </li>
        <li>
            <strong>{"VRAM"}</strong> {' — '} {"memória dedicada da GPU (GDDR/HBM)."}
          </li>
        <li>
            <strong>{"GPGPU"}</strong> {' — '} {"uso geral além de gráficos: IA, ciência, mineração."}
          </li>
        </ul>
        <h2>CPU vs GPU: Filosofias Diferentes</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-bold text-cyan-400 text-base mb-3">CPU — Latência</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>8-96 cores grandes e complexos</li>
            <li>Cache enorme (até 192 MB L3)</li>
            <li>Branch prediction sofisticada</li>
            <li>OoO execution, speculative execution</li>
            <li>Ótima para código sequencial</li>
            <li>Cada core: 3-5 GHz, alta IPC</li>
          </ul>
          <p className="text-xs text-primary mt-3">Otimizado para: minimizar latência de 1 thread</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-bold text-purple-400 text-base mb-3">GPU — Throughput</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>16.384+ núcleos simples (CUDA Cores)</li>
            <li>Cache menor, mais andar de memória</li>
            <li>HBM3e: até 3,35 TB/s de largura de banda</li>
            <li>Sem OoO (execução SIMT ordenada)</li>
            <li>Ótima para tarefas massivamente paralelas</li>
            <li>Cada CUDA core: ~1-2 GHz, simples</li>
          </ul>
          <p className="text-xs text-primary mt-3">Otimizado para: maximizar throughput de 10.000+ threads</p>
        </div>
      </div>

      <h2>Arquitetura NVIDIA (Ada Lovelace — RTX 4090)</h2>
      <CodeBlock language="text" title="NVIDIA AD102 — hierarquia de unidades" code={`
AD102 (RTX 4090):
  Transistores: 76,3 bilhões (TSMC 4nm)
  16.384 CUDA Cores
  512 Tensor Cores (4ª geração)
  128 RT Cores (3ª geração)
  Memória: 24 GB GDDR6X, 384-bit, 1,01 TB/s

Hierarquia:
  GPU
  └── 12 GPCs (Graphics Processing Clusters)
      └── 6 TPCs por GPC (= 72 TPCs total)
          └── 2 SMs por TPC (= 144 SMs total)
              └── 128 CUDA Cores por SM
              └── 4 Tensor Cores por SM
              └── L1 Cache/Shared Memory: 128 KB/SM
              └── Warp Schedulers: 4 por SM (32 threads/warp)

Compute performance:
  FP32 (single precision): 82,6 TFLOPS
  FP16 Tensor: 1.321 TFLOPS (sparse)
  INT8 Tensor: 2.642 TOPS (sparse)
      `} />

      <h2>SIMT — Single Instruction, Multiple Threads</h2>
      <p>
        GPUs usam SIMT: um único conjunto de instruções é executado por 32 threads em paralelo (um <strong>warp</strong>). Todos executam a mesma instrução, mas em dados diferentes:
      </p>
      <CodeBlock language="c" title="Kernel CUDA: cada thread processa 1 elemento" code={`
// Kernel: cada thread soma 1 elemento
__global__ void vector_add(float* C, const float* A, const float* B, int n) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < n) {
        C[idx] = A[idx] + B[idx];  // este código é executado por TODOS os threads
    }
}

// Lançamento: 1M elementos, 256 threads por bloco
int n = 1024 * 1024;
int block_size = 256;
int grid_size = (n + block_size - 1) / block_size;  // ceil(n/256)

vector_add<<<grid_size, block_size>>>(C, A, B, n);
// Lança 4096 blocos × 256 threads = 1.048.576 threads!
// GPU distribui os warps pelos SMs automaticamente

cudaDeviceSynchronize();  // espera GPU terminar
      `} />

      <h2>Warp Divergence</h2>
      <AlertBox type="warning" title="Evite branches em kernels CUDA">
        Quando threads de um mesmo warp divergem (if/else), a GPU executa ambos os branches sequencialmente, mascarando threads inativos. Isso é chamado de warp divergence e pode reduzir a utilização para 50% ou menos. Prefira máscaras e operações condicionais sem branch.
      </AlertBox>

      <CodeBlock language="c" title="Warp divergence vs código uniforme" code={`
// RUIM: divergência de warp (metade dos threads vai pelo if, metade pelo else)
__global__ void bad_kernel(float* A, int n) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (A[idx] > 0) {        // divergência!
        A[idx] = sqrt(A[idx]);
    } else {
        A[idx] = -A[idx];
    }
}

// BOM: computação uniforme sem branch (usando funções matemáticas)
__global__ void good_kernel(float* A, int n) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    float val = A[idx];
    float sign = (val > 0.0f) ? 1.0f : -1.0f;  // seleção sem branch
    A[idx] = sign * (val > 0.0f ? sqrt(val) : -val);  // predicated
}
      `} />

      <h2>Tensor Cores e IA</h2>
      <CodeBlock language="text" title="NVIDIA Tensor Cores — aceleração de GEMM" code={`
Operação: D = A × B + C (Fused Matrix Multiply-Accumulate)

4ª geração Tensor Core (Ada Lovelace):
  Operandos: FP16, BF16, TF32, INT8, INT4, FP8
  Throughput por SM: FP16 = 512 TFLOPS/SM (com sparsity 2:4)

Exemplo: FP16 sparse
  512 Tensor Cores × 512 TFLOPS/TC ≈ 1.321 TFLOPS total (RTX 4090)

Sparsity 2:4 (fine-grained structured sparsity):
  Modelo neural com 50% dos pesos zero → GPU detecta os zeros
  e comprime automaticamente → 2× throughput efetivo

NVIDIA Hopper H100 (data center):
  Tensor Cores 4ª gen + FP8 support
  FP8 Tensor: 3.958 TFLOPS
  FP16 Tensor: 1.979 TFLOPS
  HBM3: 3,35 TB/s largura de banda de memória
      `} />

      <h2>AMD ROCm e Arquitetura RDNA/CDNA</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "RDNA 3 (RX 7900 XTX)", use: "Gráficos consumer", units: "6.144 Stream Processors, 384-bit GDDR6", compute: "61 TFLOPS FP32" },
          { name: "CDNA 3 (MI300X — IA)", use: "Treinamento de IA / HPC", units: "304 Compute Units, 192 GB HBM3", compute: "2.616 TFLOPS FP8 (matrix)" },
        ].map(a => (
          <div key={a.name} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{a.name}</h3>
            <p className="text-xs text-muted-foreground mb-1">Uso: {a.use}</p>
            <p className="text-xs text-muted-foreground">{a.units}</p>
            <p className="text-xs font-bold text-foreground mt-2">{a.compute}</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
