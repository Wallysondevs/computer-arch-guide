import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { Cpu, MemoryStick, Layers, Zap } from "lucide-react";

export default function Introducao() {
  return (
    <PageContainer
      title="Arquiteturas de Computadores"
      subtitle="Do transistor ao supercomputador — entenda como os computadores funcionam de dentro para fora."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <AlertBox type="info" title="O que você vai aprender">
        Este guia cobre os fundamentos das arquiteturas de computadores, desde lógica digital básica até processadores modernos com IA, GPUs e computação quântica — tudo em Português Brasileiro.
      </AlertBox>

      <h2>O que é Arquitetura de Computadores?</h2>
      <p>
        Arquitetura de computadores é o conjunto de regras e métodos que descrevem como os componentes de um computador funcionam e interagem entre si. É a ponte entre hardware e software — define o que o processador pode fazer e como o programador deve pensar sobre o sistema.
      </p>
      <p>
        Podemos dividir o estudo em três níveis:
      </p>
      <ul>
        <li><strong>Organização do computador</strong> — como os componentes físicos se conectam e operam</li>
        <li><strong>Arquitetura do conjunto de instruções (ISA)</strong> — o contrato entre hardware e software</li>
        <li><strong>Microarquitetura</strong> — a implementação concreta do ISA dentro do chip</li>
      </ul>

      <h2>Uma Breve História</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 not-prose">
        {[
          { year: "1945", event: "Arquitetura de Von Neumann", desc: "John von Neumann define o modelo de computador com unidade central, memória e I/O — ainda usado hoje." },
          { year: "1947", event: "Invenção do transistor", desc: "Bell Labs inventa o transistor, substituindo as válvulas termiônicas e tornando os computadores menores." },
          { year: "1971", event: "Primeiro microprocessador", desc: "Intel 4004: 2.300 transistores, 108 kHz. Deu início à era dos microcomputadores." },
          { year: "2024", event: "Processadores modernos", desc: "Apple M4 Ultra: 92 bilhões de transistores em 3nm. Performance absurda em tamanho minúsculo." },
        ].map((item) => (
          <div key={item.year} className="bg-card border border-border rounded-xl p-5">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">{item.year}</span>
            <h3 className="text-base font-bold text-foreground mt-1 mb-2">{item.event}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <h2>Os Grandes Blocos de um Computador</h2>
      <p>
        Todo computador moderno segue o modelo de Von Neumann, composto por quatro grandes componentes que se comunicam através de barramentos:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 not-prose">
        {[
          { icon: <Cpu className="w-6 h-6 text-cyan-400" />, name: "Unidade Central de Processamento (CPU)", desc: "Executa instruções, realiza cálculos, controla o fluxo do programa." },
          { icon: <MemoryStick className="w-6 h-6 text-purple-400" />, name: "Memória", desc: "Armazena dados e instruções temporariamente (RAM) ou permanentemente (SSD/HDD)." },
          { icon: <Zap className="w-6 h-6 text-yellow-400" />, name: "Entrada e Saída (I/O)", desc: "Dispositivos como teclado, monitor, rede — interface com o mundo externo." },
          { icon: <Layers className="w-6 h-6 text-green-400" />, name: "Barramentos", desc: "Canais de comunicação que interligam todos os componentes: dados, endereços e controle." },
        ].map((item) => (
          <div key={item.name} className="bg-card border border-border rounded-xl p-5 flex gap-4">
            <div className="shrink-0 mt-0.5">{item.icon}</div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Por que Estudar Arquiteturas?</h2>
      <p>
        Entender arquiteturas de computadores é essencial para qualquer profissional de tecnologia:
      </p>
      <ul>
        <li><strong>Programadores</strong> escrevem código mais eficiente quando sabem como o cache funciona, o custo de operações de memória, e como o compilador usa os registradores.</li>
        <li><strong>Engenheiros de sistemas</strong> escolhem hardware adequado para cargas de trabalho específicas com base em NUMA, largura de banda de memória, e throughput de I/O.</li>
        <li><strong>Pesquisadores de segurança</strong> exploram vulnerabilidades como Spectre e Meltdown que existem por causa de otimizações microarquiteturais.</li>
        <li><strong>Desenvolvedores de compiladores e SOs</strong> dependem diretamente do ISA e das características da microarquitetura.</li>
      </ul>

      <h2>Estrutura do Guia</h2>
      <p>
        Este guia está organizado em 8 seções, cada uma construindo sobre a anterior:
      </p>
      <ol>
        <li><strong>Fundamentos Digitais</strong> — lógica, binário, circuitos</li>
        <li><strong>O Processador</strong> — CPU, instruções, pipeline</li>
        <li><strong>Hierarquia de Memória</strong> — cache, DRAM, virtual, armazenamento</li>
        <li><strong>Entrada e Saída</strong> — barramentos, interrupções, DMA</li>
        <li><strong>Arquiteturas CISC e RISC</strong> — x86, ARM, RISC-V</li>
        <li><strong>Paralelismo e Performance</strong> — multicore, GPU, SIMD</li>
        <li><strong>Computação Especializada</strong> — FPGA, ASIC, NPU, SoC</li>
        <li><strong>Tópicos Avançados</strong> — segurança, computação quântica, futuro</li>
      </ol>

      <AlertBox type="success" title="Dica de leitura">
        Se você é iniciante, siga a ordem das seções. Se já tem experiência, use a barra lateral para navegar diretamente pelos tópicos de interesse.
      </AlertBox>
    </PageContainer>
  );
}
