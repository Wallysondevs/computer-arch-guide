import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SIMD() {
  return (
    <PageContainer
      title="SIMD e Vetorização"
      subtitle="Single Instruction, Multiple Data — processando múltiplos dados em paralelo em um único ciclo de CPU."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"SIMD"}</strong> {' — '} {"Single Instruction Multiple Data — vetoriza operações."}
          </li>
        <li>
            <strong>{"SSE/AVX"}</strong> {' — '} {"extensões SIMD da Intel (128/256/512 bits)."}
          </li>
        <li>
            <strong>{"NEON"}</strong> {' — '} {"SIMD da ARM."}
          </li>
        <li>
            <strong>{"Aplicações"}</strong> {' — '} {"multimídia, ciência, IA, criptografia."}
          </li>
        <li>
            <strong>{"Auto-vetorização"}</strong> {' — '} {"compiladores tentam usar SIMD automaticamente."}
          </li>
        </ul>
        <h2>O que é SIMD?</h2>
      <p>
        SIMD (Single Instruction, Multiple Data) permite que uma única instrução opere em múltiplos valores de dados ao mesmo tempo, usando registradores vetoriais. Em vez de somar dois floats, somamos 4, 8, ou 16 floats em um único ciclo.
      </p>

      <CodeBlock language="text" title="Escalar vs SIMD" code={`
// Escalar (1 soma por ciclo):
C[0] = A[0] + B[0]
C[1] = A[1] + B[1]
C[2] = A[2] + B[2]
C[3] = A[3] + B[3]
→ 4 instruções ADD

// SIMD AVX (4 somas em 1 ciclo, registradores de 128-bit):
[C0,C1,C2,C3] = [A0,A1,A2,A3] + [B0,B1,B2,B3]
→ 1 instrução ADDPS

// SIMD AVX-512 (16 somas em 1 ciclo, registradores de 512-bit):
[C0..C15] = [A0..A15] + [B0..B15]
→ 1 instrução VADDPS zmm0, zmm1, zmm2
      `} />

      <h2>Evolução das Extensões SIMD x86</h2>
      <div className="not-prose space-y-2 my-6">
        {[
          { ext: "MMX (1997)", reg: "64-bit", elems: "8×8-bit ou 4×16-bit ou 2×32-bit int", tp: "2-4 ops/ciclo", use: "Vídeo, compressão" },
          { ext: "SSE (1999)", reg: "128-bit (XMM)", elems: "4×float32", tp: "4 floats/ciclo", use: "Jogos 3D, DSP" },
          { ext: "SSE2 (2001)", reg: "128-bit (XMM)", elems: "2×float64 ou 16×int8 ou 8×int16", tp: "Versátil", use: "Substitui MMX definitivamente" },
          { ext: "SSE4.1/4.2 (2007)", reg: "128-bit (XMM)", elems: "Mesmos + instruções string, blend", tp: "—", use: "Busca de string, blend de pixels" },
          { ext: "AVX (2011)", reg: "256-bit (YMM)", elems: "8×float32 ou 4×float64", tp: "8 floats/ciclo", use: "HPC, processamento de imagem" },
          { ext: "AVX2 (2013)", reg: "256-bit (YMM)", elems: "+ inteiros 256-bit, FMA3", tp: "—", use: "Machine learning básico, codecs" },
          { ext: "AVX-512 (2016)", reg: "512-bit (ZMM)", elems: "16×float32 ou 8×float64", tp: "16 floats/ciclo!", use: "HPC, IA, crypto" },
          { ext: "AVX-VNNI / AMX (2023)", reg: "512-bit / Tile", elems: "Operações de inferência (INT8, BF16)", tp: "Matriz 16×16 por instrução (AMX)", use: "Inferência de redes neurais" },
        ].map(e => (
          <div key={e.ext} className="bg-card border border-border rounded-xl p-3 flex flex-wrap items-center gap-x-6 gap-y-1">
            <span className="font-bold text-primary text-sm w-36 shrink-0">{e.ext}</span>
            <span className="font-mono text-xs text-foreground">{e.reg}</span>
            <span className="text-xs text-muted-foreground">{e.elems}</span>
          </div>
        ))}
      </div>

      <h2>Vetorização Automática</h2>
      <p>
        Compiladores modernos (GCC, Clang) podem vetorizar automaticamente loops simples. Mas o código deve ser escrito de forma "vetorizável":
      </p>
      <CodeBlock language="c" title="Vetorização automática com GCC" code={`
// Loop vetorizável: sem dependências entre iterações
void add_arrays(float* C, const float* A, const float* B, int n) {
    for (int i = 0; i < n; i++) {
        C[i] = A[i] + B[i];  // cada iteração é independente!
    }
}
// Compilar com: gcc -O3 -march=native -ftree-vectorize
// GCC gera instrução VADDPS (AVX2: 8 floats/iteração real do loop)

// NÃO vetorizável: dependência entre iterações
void prefix_sum(float* A, int n) {
    for (int i = 1; i < n; i++) {
        A[i] += A[i-1];  // A[i] depende de A[i-1]!
    }
}

// Dicas para vetorização automática:
// ✓ Evite ponteiros com possível aliasing (use __restrict__)
// ✓ Arrays alinhados a 32/64 bytes (__attribute__((aligned(32))))
// ✓ Loops com contagem conhecida
// ✓ Evite desvios condicionais dentro do loop
      `} />

      <h2>Intrinsics: Vetorização Manual</h2>
      <CodeBlock language="c" title="AVX2 intrinsics: soma de 8 floats" code={`
#include <immintrin.h>  // AVX/AVX2/AVX-512 intrinsics

void add_arrays_avx2(float* C, const float* A, const float* B, int n) {
    int i = 0;
    
    // Processa 8 floats por iteração (AVX2: 256-bit / 32-bit = 8 elems)
    for (; i <= n - 8; i += 8) {
        __m256 va = _mm256_loadu_ps(&A[i]);  // carrega 8 floats de A
        __m256 vb = _mm256_loadu_ps(&B[i]);  // carrega 8 floats de B
        __m256 vc = _mm256_add_ps(va, vb);   // soma 8 pares
        _mm256_storeu_ps(&C[i], vc);          // armazena 8 resultados
    }
    
    // Tail: processa os últimos elementos restantes (< 8)
    for (; i < n; i++) {
        C[i] = A[i] + B[i];
    }
}

// Speedup típico: 6-8× sobre código escalar (vs 8× teórico)
// (overhead de load/store e loop control reduz um pouco)
      `} />

      <h2>ARM NEON e SVE</h2>
      <CodeBlock language="c" title="ARM NEON: 4 floats por instrução" code={`
#include <arm_neon.h>

void add_arrays_neon(float* C, const float* A, const float* B, int n) {
    int i = 0;
    for (; i <= n - 4; i += 4) {
        float32x4_t va = vld1q_f32(&A[i]);   // load 4 floats
        float32x4_t vb = vld1q_f32(&B[i]);   // load 4 floats
        float32x4_t vc = vaddq_f32(va, vb);  // add 4 floats
        vst1q_f32(&C[i], vc);                 // store 4 floats
    }
    for (; i < n; i++) C[i] = A[i] + B[i];
}

// ARM SVE (Scalable Vector Extension): tamanho variável!
// O mesmo código funciona em hardware com 128, 256, 512, 1024, 2048 bits
// O hardware declara o tamanho via registrador especial (VL)
// Perfeito para portabilidade entre chips diferentes
      `} />

      <AlertBox type="info" title="SIMD é a base do machine learning">
        Redes neurais são essencialmente multiplicação de matrizes (GEMM). FMA (Fused Multiply-Add) SIMD é o coração da inferência. Um tensor core do NVIDIA Hopper calcula D=A×B+C para matrizes 4×4 de FP16 em 1 ciclo — equivalente a 16 FMAs vetoriais simultâneos. Todo o progresso em IA depende dessa potência computacional.
      </AlertBox>
    </PageContainer>
  );
}
