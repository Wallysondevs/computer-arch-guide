import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CircuitosCombinacionais() {
  return (
    <PageContainer
      title="Circuitos Combinacionais"
      subtitle="Circuitos cuja saída depende apenas das entradas atuais — os blocos básicos de processadores."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"Combinacional"}</strong> {' — '} {"saída depende só das entradas atuais (sem memória)."}
          </li>
        <li>
            <strong>{"Multiplexer"}</strong> {' — '} {"seleciona uma de N entradas."}
          </li>
        <li>
            <strong>{"Decoder"}</strong> {' — '} {"converte código binário em uma saída única ativa."}
          </li>
        <li>
            <strong>{"Adder"}</strong> {' — '} {"soma binária — meio somador, somador completo."}
          </li>
        <li>
            <strong>{"ALU"}</strong> {' — '} {"Arithmetic Logic Unit — coração do CPU."}
          </li>
        </ul>
        <h2>O que são Circuitos Combinacionais?</h2>
      <p>
        Em circuitos combinacionais, a saída é uma função direta das entradas atuais — sem memória ou estado interno. Diferentemente dos circuitos sequenciais, não há realimentação. São implementados por redes de portas lógicas.
      </p>

      <h2>Somadores</h2>
      <h3>Half Adder (Meio Somador)</h3>
      <p>Soma dois bits, produzindo Sum e Carry:</p>
      <CodeBlock language="text" title="Half Adder" code={`
Entradas: A, B
Saídas:   Sum = A ⊕ B (XOR)
          Carry = A · B (AND)

Tabela verdade:
A  B | Sum  Carry
0  0 |  0     0
0  1 |  1     0
1  0 |  1     0
1  1 |  0     1   ← 1+1 = 10 em binário
      `} />

      <h3>Full Adder (Somador Completo)</h3>
      <p>Soma três bits (A, B e Carry-in), essencial para somas de múltiplos bits em cascata:</p>
      <CodeBlock language="text" title="Full Adder" code={`
Saídas: Sum   = A ⊕ B ⊕ Cin
        Cout  = (A·B) + (Cin·(A⊕B))

Para somar 4+5 (0100 + 0101) bit a bit:
  Bit 0: 0+1+0 = 1, carry=0
  Bit 1: 0+0+0 = 0, carry=0
  Bit 2: 1+1+0 = 0, carry=1
  Bit 3: 0+0+1 = 1, carry=0
  Resultado: 1001 = 9 ✓
      `} />

      <h2>Multiplexadores (MUX)</h2>
      <p>
        Um MUX seleciona uma de <em>n</em> entradas para a saída, com base em bits de seleção. É como um interruptor controlado digitalmente.
      </p>
      <CodeBlock language="text" title="MUX 4:1 (4 entradas, 2 bits de seleção)" code={`
Entradas: D0, D1, D2, D3
Seleção:  S1, S0
Saída:    Y

S1 S0 | Y
 0  0 | D0   (seleciona D0)
 0  1 | D1   (seleciona D1)
 1  0 | D2   (seleciona D2)
 1  1 | D3   (seleciona D3)

Y = (D0·S̄1·S̄0) + (D1·S̄1·S0) + (D2·S1·S̄0) + (D3·S1·S0)

Uso na CPU: selecionar a fonte de dados para a ALU
      `} />

      <h2>Decodificadores</h2>
      <p>
        Decodificadores convertem código binário em seleção de uma linha. Com n entradas, ativam 1 de 2ⁿ saídas.
      </p>
      <CodeBlock language="text" title="Decodificador 2:4" code={`
Entradas: A1, A0
Saídas:   Y0, Y1, Y2, Y3 (apenas uma ativa por vez)

A1 A0 | Y3 Y2 Y1 Y0
 0  0 |  0  0  0  1   ← Y0 ativo
 0  1 |  0  0  1  0   ← Y1 ativo
 1  0 |  0  1  0  0   ← Y2 ativo
 1  1 |  1  0  0  0   ← Y3 ativo

Uso: decodificação de endereços de memória,
     seleção de chips (chip select)
      `} />

      <h2>Comparadores</h2>
      <p>Comparam dois números binários, indicando se são iguais ou qual é maior:</p>
      <CodeBlock language="text" title="Comparador de 1 bit" code={`
Igualdade:     EQ = XNOR(A,B) = NOT(A XOR B)
A maior que B: A > B = A · NOT(B)
A menor que B: A < B = NOT(A) · B

Para n bits: compara bit a bit do mais significativo para o menos
      `} />

      <h2>ULA — Unidade Lógica e Aritmética</h2>
      <p>
        A ALU (Arithmetic Logic Unit) é o coração da CPU. Ela combina múltiplos circuitos combinacionais para executar operações aritméticas e lógicas:
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { cat: "Aritméticas", ops: "ADD, SUB, INC, DEC, NEG, comparação signed/unsigned" },
          { cat: "Lógicas", ops: "AND, OR, XOR, NOT, deslocamento left/right, rotação" },
          { cat: "Deslocamentos", ops: "SHL (shift left = ×2), SHR (shift right = ÷2), SAR (aritmético)" },
          { cat: "Seleção de operação", ops: "Bits de controle da UC definem qual operação executar" },
        ].map(item => (
          <div key={item.cat} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-2">{item.cat}</h3>
            <p className="text-sm text-muted-foreground">{item.ops}</p>
          </div>
        ))}
      </div>

      <CodeBlock language="text" title="ALU simplificada de 1 bit" code={`
Operação | F2 F1 F0 | Resultado
  AND    |  0  0  0  | A · B
  OR     |  0  0  1  | A + B
  XOR    |  0  1  0  | A ⊕ B
  NOT A  |  0  1  1  | Ā
  ADD    |  1  0  0  | A + B (com carry)
  SUB    |  1  0  1  | A - B (usando complemento a 2)
  SHL    |  1  1  0  | A << 1
  SHR    |  1  1  1  | A >> 1
      `} />

      <h2>Atraso de Propagação e Caminho Crítico</h2>
      <p>
        O <strong>caminho crítico</strong> é a sequência de portas com maior delay total entre entrada e saída. Ele determina a frequência máxima de operação:
      </p>
      <CodeBlock language="text" title="Exemplo de análise de timing" code={`
Porta AND: tpd = 0.2 ns
Porta OR:  tpd = 0.2 ns
Porta XOR: tpd = 0.3 ns

Full Adder - caminho crítico (Cin → Cout):
  Cin → XOR1 → AND2 → OR → Cout
  0.3 + 0.2 + 0.2 = 0.7 ns

Frequência máxima ≈ 1/0.7 ns ≈ 1.4 GHz
(Na prática, considera-se também setup/hold times dos flip-flops)
      `} />

      <AlertBox type="info" title="Carry Lookahead Adder (CLA)">
        Somadores Ripple Carry em cascata são lentos porque o carry se propaga bit a bit. O CLA calcula os carries em paralelo usando lógica adicional, reduzindo o atraso de O(n) para O(log n). É o tipo de somador usado na ALU da maioria das CPUs modernas.
      </AlertBox>

      <h2>ROM como Função Combinacional</h2>
      <p>
        Uma ROM (Read-Only Memory) pode implementar qualquer função combinacional: o endereço é a entrada e o conteúdo é a saída. Isso é usado em lookup tables (LUTs) de FPGAs e em tabelas de decodificação de instruções.
      </p>
      <CodeBlock language="text" title="ROM como função booleana" code={`
ROM 8x4 bits implementando uma função f(A,B,C) → D3D2D1D0:

Endereço | Dado armazenado
  000    | 0101
  001    | 1010
  010    | 0011
  011    | 1100
  ...

Basta escrever o valor desejado em cada endereço.
FPGAs usam LUTs de 6 entradas (64 bits de RAM) para isso.
      `} />
    </PageContainer>
  );
}
