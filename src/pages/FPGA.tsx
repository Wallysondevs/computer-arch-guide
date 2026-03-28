import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FPGA() {
  return (
    <PageContainer
      title="FPGAs"
      subtitle="Field-Programmable Gate Arrays — chips cujo hardware pode ser reconfigurado para qualquer função digital."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <h2>O que é um FPGA?</h2>
      <p>
        Um FPGA (Field-Programmable Gate Array) é um chip que contém milhões de blocos lógicos, memórias e interconexões programáveis. Diferente de um CPU (software programa o comportamento) ou ASIC (hardware fixo na fábrica), um FPGA pode ser configurado e reconfigurado para implementar qualquer circuito digital.
      </p>

      <h2>Componentes Internos de um FPGA</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "LUT (Look-Up Table)", desc: "A unidade básica. Uma LUT de 6 entradas = ROM de 64 bits que implementa qualquer função booleana de 6 variáveis. Equivale a combinações de portas lógicas." },
          { name: "Flip-Flop (FF)", desc: "Armazenamento de estado. Cada slice LUT tem flip-flops associados para implementar lógica sequencial." },
          { name: "DSP Slices", desc: "Multiplicadores e acumuladores de alta velocidade em hardware dedicado. Essenciais para operações de ponto flutuante e filtros DSP." },
          { name: "Block RAM (BRAM)", desc: "Blocos de SRAM duplo-porte (tipicamente 36KB). Implementa FIFOs, buffers, ROMs de lookup e caches personalizadas." },
          { name: "I/O Banks", desc: "Pinos configuráveis que suportam múltiplos protocolos (LVCMOS, LVDS, SSTL) e velocidades. Serializadores/desserializadores embutidos." },
          { name: "Transceptores (MGT)", desc: "Serdes de alta velocidade (até 116 Gbps) para PCIe, Ethernet 100GbE, CPRI, JESD204B, etc." },
        ].map(c => (
          <div key={c.name} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{c.name}</h3>
            <p className="text-sm text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </div>

      <h2>Fluxo de Projeto FPGA</h2>
      <CodeBlock language="text" title="Do código HDL ao bitstream" code={`
1. ESPECIFICAÇÃO
   Definir o circuito em HDL (Hardware Description Language)

2. SÍNTESE (Synthesis)
   HDL → netlist de células lógicas primitivas
   Ferramentas: Vivado (Xilinx), Quartus (Intel), Yosys (open-source)

3. IMPLEMENTAÇÃO
   a. Mapeamento (Mapping): células → LUTs e FFs do FPGA alvo
   b. Place (Placement): posicionamento dos elementos no chip
   c. Route (Routing): ligação dos elementos por interconexões
   d. Timing Analysis: verificar se todos os caminhos respeitam o clock

4. GERAÇÃO DO BITSTREAM
   Arquivo de configuração (milhões de bits) que programa o FPGA

5. PROGRAMAÇÃO
   Bitstream → FPGA via JTAG (programação temporária)
              → Flash SPI (programação persistente)

Ciclo de iteração: minutos a horas (vs meses para ASIC!)
      `} />

      <h2>Linguagens HDL</h2>
      <CodeBlock language="verilog" title="Verilog: somador de 4 bits" code={`
// Módulo somador simples em Verilog
module adder4 (
    input  [3:0] A,     // 4 bits de entrada A
    input  [3:0] B,     // 4 bits de entrada B
    input        Cin,   // carry in
    output [3:0] Sum,   // 4 bits de soma
    output       Cout   // carry out
);
    assign {Cout, Sum} = A + B + Cin;
endmodule

// Módulo com registrador (lógica sequencial):
module reg_adder (
    input        clk, rst,
    input  [7:0] A, B,
    output reg [8:0] result
);
    always @(posedge clk) begin
        if (rst)
            result <= 9'b0;
        else
            result <= A + B;  // registrado na borda de subida do clock
    end
endmodule
      `} />

      <CodeBlock language="text" title="VHDL: mesma lógica em VHDL (padrão IEEE 1076)" code={`
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity reg_adder is
    Port (
        clk    : in  STD_LOGIC;
        rst    : in  STD_LOGIC;
        A, B   : in  UNSIGNED(7 downto 0);
        result : out UNSIGNED(8 downto 0)
    );
end reg_adder;

architecture Behavioral of reg_adder is
begin
    process(clk)
    begin
        if rising_edge(clk) then
            if rst = '1' then
                result <= (others => '0');
            else
                result <= ('0' & A) + ('0' & B);
            end if;
        end if;
    end process;
end Behavioral;
      `} />

      <h2>FPGAs Modernos: Xilinx/AMD e Intel</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "AMD Virtex UltraScale+", luts: "4.085.760 LUTs", ram: "94.5 MB BRAM + UltraRAM", dsp: "11.508 DSP", note: "Maior FPGA do mundo. Data center, HPC, 5G." },
          { name: "Intel Agilex 7", luts: "1.778.880 LEs", ram: "Milhares de M20K (20 KB cada)", dsp: "9.216 DSP (18×18)", note: "14nm (Intel), transceptores 112G. Cloud FPGAs na AWS (F-series)." },
          { name: "AMD Zynq UltraScale+", luts: "Até 600K", extra: "Quad-core ARM Cortex-A53 + GPU integrados!", note: "SoC FPGA: CPU + FPGA no mesmo chip. IoT, robótica, telecomunicações." },
          { name: "Intel Cyclone/Arria", luts: "Pequenos a médios", note: "Custo-benefício. Prototipagem, produtos de volume médio.", dsp: "—", ram: "—" },
        ].map(f => (
          <div key={f.name} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-2">{f.name}</h3>
            {f.luts && <p className="text-xs text-muted-foreground">{f.luts}</p>}
            {f.ram && <p className="text-xs text-muted-foreground">{f.ram}</p>}
            {f.extra && <p className="text-xs text-cyan-400">{f.extra}</p>}
            <p className="text-xs text-muted-foreground mt-1">{f.note}</p>
          </div>
        ))}
      </div>

      <AlertBox type="success" title="HLS: Hardware Description em C++">
        High-Level Synthesis (HLS) permite escrever hardware em C/C++ ou Python, e o compilador gera Verilog/VHDL automaticamente. AMD Vitis HLS e Intel HLS Compiler tornam FPGAs mais acessíveis a engenheiros de software. Bibliotecas como PYNQ permitem controlar FPGAs com Python diretamente.
      </AlertBox>
    </PageContainer>
  );
}
