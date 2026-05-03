import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function RepresentacaoDados() {
  return (
    <PageContainer
      title="Representação de Dados"
      subtitle="Como computadores armazenam e processam números, texto e dados em geral usando o sistema binário."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"Binário"}</strong> {' — '} {"base 2 — natural para circuitos digitais."}
          </li>
        <li>
            <strong>{"Hexadecimal"}</strong> {' — '} {"base 16 — atalho para ler binário."}
          </li>
        <li>
            <strong>{"Two's complement"}</strong> {' — '} {"representação padrão de inteiros com sinal."}
          </li>
        <li>
            <strong>{"IEEE 754"}</strong> {' — '} {"padrão de ponto flutuante (float, double)."}
          </li>
        <li>
            <strong>{"ASCII/Unicode"}</strong> {' — '} {"codificação de caracteres."}
          </li>
        </ul>
        <h2>Por que Binário?</h2>
      <p>
        Computadores usam o sistema binário (base 2) porque transistores têm dois estados estáveis: ligado (1) e desligado (0). Tensões elétricas representam esses estados — tipicamente 0V para 0 e 3,3V ou 5V para 1.
      </p>
      <p>
        Um único dígito binário é chamado de <strong>bit</strong> (binary digit). 8 bits formam um <strong>byte</strong>.
      </p>

      <h2>Sistemas de Numeração</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
        {[
          { base: "Decimal (Base 10)", digits: "0-9", example: "42", desc: "Sistema que humanos usam naturalmente" },
          { base: "Binário (Base 2)", digits: "0-1", example: "101010", desc: "Sistema nativo dos computadores" },
          { base: "Hexadecimal (Base 16)", digits: "0-9, A-F", example: "2A", desc: "Forma compacta de representar binário" },
        ].map(s => (
          <div key={s.base} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold text-foreground text-sm mb-1">{s.base}</h3>
            <p className="text-xs text-muted-foreground mb-2">{s.desc}</p>
            <div className="font-mono text-lg text-primary">{s.example}</div>
            <div className="text-xs text-muted-foreground mt-1">Dígitos: {s.digits}</div>
          </div>
        ))}
      </div>

      <h2>Conversões</h2>
      <h3>Decimal para Binário</h3>
      <p>Divida o número por 2 repetidamente, anotando os restos de baixo para cima:</p>
      <CodeBlock language="text" title="Convertendo 42 para binário" code={`
42 ÷ 2 = 21  resto 0
21 ÷ 2 = 10  resto 1
10 ÷ 2 = 5   resto 0
 5 ÷ 2 = 2   resto 1
 2 ÷ 2 = 1   resto 0
 1 ÷ 2 = 0   resto 1

Lendo de baixo para cima: 101010
42₁₀ = 101010₂
      `} />

      <h3>Binário para Hexadecimal</h3>
      <p>Agrupe os bits de 4 em 4 (nibbles) da direita para a esquerda:</p>
      <CodeBlock language="text" title="Binário → Hexadecimal" code={`
Binário:    0010  1010
Hex:          2     A
Resultado: 0x2A (ou 2A₁₆)

Tabela:
0000 = 0    0100 = 4    1000 = 8    1100 = C
0001 = 1    0101 = 5    1001 = 9    1101 = D
0010 = 2    0110 = 6    1010 = A    1110 = E
0011 = 3    0111 = 7    1011 = B    1111 = F
      `} />

      <h2>Tipos de Dados Inteiros</h2>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="border border-border px-4 py-2 text-left font-semibold">Tipo (C/C++)</th>
              <th className="border border-border px-4 py-2 text-left font-semibold">Bits</th>
              <th className="border border-border px-4 py-2 text-left font-semibold">Sem sinal (unsigned)</th>
              <th className="border border-border px-4 py-2 text-left font-semibold">Com sinal (signed)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["char", "8", "0 a 255", "-128 a 127"],
              ["short", "16", "0 a 65.535", "-32.768 a 32.767"],
              ["int / long", "32", "0 a 4.294.967.295", "-2.147.483.648 a 2.147.483.647"],
              ["long long", "64", "0 a 18,4 × 10¹⁸", "-9,2 × 10¹⁸ a 9,2 × 10¹⁸"],
            ].map(([type, bits, unsigned, signed]) => (
              <tr key={type} className="hover:bg-muted/30">
                <td className="border border-border px-4 py-2 font-mono text-primary">{type}</td>
                <td className="border border-border px-4 py-2">{bits}</td>
                <td className="border border-border px-4 py-2">{unsigned}</td>
                <td className="border border-border px-4 py-2">{signed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Complemento a Dois (Two's Complement)</h2>
      <p>
        Para representar números negativos, computadores usam o método do complemento a dois. Este método permite que a adição funcione identicamente para positivos e negativos, sem circuitos especiais.
      </p>
      <p><strong>Como calcular o complemento a dois de um número negativo:</strong></p>
      <ol>
        <li>Escreva a representação binária do valor absoluto</li>
        <li>Inverta todos os bits (complemento a um)</li>
        <li>Adicione 1 ao resultado</li>
      </ol>
      <CodeBlock language="text" title="Representando -5 em 8 bits" code={`
Passo 1: +5 em binário = 00000101
Passo 2: Inverter bits  = 11111010  (complemento a um)
Passo 3: Adicionar 1    = 11111011  (complemento a dois = -5)

Verificação: 00000101 + 11111011 = 100000000
             (o carry final é descartado, resultado = 00000000 = 0 ✓)
      `} />

      <h2>Ponto Flutuante (IEEE 754)</h2>
      <p>
        Números reais são representados no padrão IEEE 754. Um float de 32 bits tem três campos:
      </p>
      <CodeBlock language="text" title="Estrutura float 32 bits (IEEE 754)" code={`
Bit 31  Bits 30-23     Bits 22-0
  S      EEEEEEEE      MMMMMMMMMMMMMMMMMMMMMMM
(Sinal)  (Expoente)     (Mantissa/Fração)

Valor = (-1)^S × 2^(E-127) × (1.Mantissa)

Exemplos especiais:
  E=0,   M=0  → Zero (±0)
  E=255, M=0  → Infinito (±∞)
  E=255, M≠0  → NaN (Not a Number)
  E=0,   M≠0  → Desnormalizado (números muito pequenos)
      `} />

      <h2>Representação de Texto</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "ASCII", desc: "7 bits, 128 caracteres. Suficiente para inglês. Caracteres 0-31 são de controle (newline, tab, etc.)." },
          { name: "Latin-1 (ISO-8859-1)", desc: "8 bits, 256 caracteres. Adiciona acentuados europeus como á, ç, ñ." },
          { name: "UTF-8", desc: "Codificação de largura variável (1-4 bytes). Compatível com ASCII e suporta todos os caracteres Unicode." },
          { name: "UTF-16/UTF-32", desc: "Usados internamente por Java, Windows APIs e JavaScript. Cada caractere ocupa 2 ou 4 bytes." },
        ].map(e => (
          <div key={e.name} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{e.name}</h3>
            <p className="text-sm text-muted-foreground">{e.desc}</p>
          </div>
        ))}
      </div>

      <AlertBox type="warning" title="Cuidado com overflow">
        Se você soma 127 + 1 em um tipo char de 8 bits com sinal, o resultado é -128 (overflow). Sempre verifique os limites dos tipos de dados em linguagens como C/C++.
      </AlertBox>

      <h2>Endianness</h2>
      <p>
        Quando um inteiro de múltiplos bytes é armazenado na memória, a ordem dos bytes importa:
      </p>
      <CodeBlock language="text" title="Representando 0x12345678 na memória" code={`
Big-Endian (byte mais significativo primeiro):
  Endereço: 0x100  0x101  0x102  0x103
  Valor:     0x12   0x34   0x56   0x78
  (usado por: redes TCP/IP, PowerPC, SPARC)

Little-Endian (byte menos significativo primeiro):
  Endereço: 0x100  0x101  0x102  0x103
  Valor:     0x78   0x56   0x34   0x12
  (usado por: x86, ARM (padrão), RISC-V)
      `} />
    </PageContainer>
  );
}
