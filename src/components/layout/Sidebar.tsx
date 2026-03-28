import { useState } from "react";
import { useHashLocation } from "wouter/use-hash-location";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Cpu, ChevronDown, ChevronRight, Menu, X,
  CircuitBoard, MemoryStick, Zap, Layers, Server, Atom, Telescope,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
}
interface NavSection {
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    label: "Fundamentos Digitais",
    icon: <CircuitBoard className="w-4 h-4" />,
    items: [
      { label: "Introdução", path: "/" },
      { label: "Representação de Dados", path: "/dados" },
      { label: "Álgebra Booleana", path: "/booleana" },
      { label: "Circuitos Combinacionais", path: "/combinacional" },
      { label: "Circuitos Sequenciais", path: "/sequencial" },
    ],
  },
  {
    label: "O Processador",
    icon: <Cpu className="w-4 h-4" />,
    items: [
      { label: "Organização da CPU", path: "/cpu" },
      { label: "Ciclo de Instrução", path: "/ciclo" },
      { label: "Conjunto de Instruções (ISA)", path: "/isa" },
      { label: "Modos de Endereçamento", path: "/enderecamento" },
      { label: "Pipeline", path: "/pipeline" },
    ],
  },
  {
    label: "Hierarquia de Memória",
    icon: <MemoryStick className="w-4 h-4" />,
    items: [
      { label: "Visão Geral", path: "/hierarquia" },
      { label: "Memória Cache", path: "/cache" },
      { label: "Memória Principal (DRAM)", path: "/dram" },
      { label: "Memória Virtual", path: "/virtual" },
      { label: "Armazenamento (SSD/NVMe)", path: "/armazenamento" },
    ],
  },
  {
    label: "Entrada e Saída",
    icon: <Zap className="w-4 h-4" />,
    items: [
      { label: "Sistemas de I/O", path: "/io" },
      { label: "Barramentos (PCIe, USB)", path: "/barramentos" },
      { label: "Interrupções e DMA", path: "/interrupcoes" },
      { label: "Controladores e Periféricos", path: "/controladores" },
    ],
  },
  {
    label: "Arquiteturas CISC e RISC",
    icon: <Layers className="w-4 h-4" />,
    items: [
      { label: "CISC vs RISC", path: "/cisc-risc" },
      { label: "Arquitetura x86 / x86-64", path: "/x86" },
      { label: "Arquitetura ARM", path: "/arm" },
      { label: "RISC-V", path: "/riscv" },
    ],
  },
  {
    label: "Paralelismo e Performance",
    icon: <Server className="w-4 h-4" />,
    items: [
      { label: "Superescalaridade e OoO", path: "/superescalar" },
      { label: "Multicore e Multithreading", path: "/multicore" },
      { label: "SIMD e Vetorização", path: "/simd" },
      { label: "GPU e Computação Paralela", path: "/gpu" },
      { label: "NUMA e Sistemas Distribuídos", path: "/numa" },
    ],
  },
  {
    label: "Computação Especializada",
    icon: <Cpu className="w-4 h-4" />,
    items: [
      { label: "FPGAs", path: "/fpga" },
      { label: "ASICs", path: "/asic" },
      { label: "NPU e TPU (IA)", path: "/npu-tpu" },
      { label: "SoC (System on Chip)", path: "/soc" },
    ],
  },
  {
    label: "Tópicos Avançados",
    icon: <Atom className="w-4 h-4" />,
    items: [
      { label: "Segurança em Hardware", path: "/seguranca" },
      { label: "Computação Quântica", path: "/quantica" },
      { label: "Tendências e Futuro", path: "/tendencias" },
    ],
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useHashLocation();
  const [openSections, setOpenSections] = useState<Set<number>>(() => {
    const set = new Set<number>();
    sections.forEach((section, idx) => {
      if (section.items.some(item => item.path === location || (location === "/" && item.path === "/"))) {
        set.add(idx);
      }
    });
    if (set.size === 0) set.add(0);
    return set;
  });

  const toggleSection = (idx: number) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Cpu className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-sidebar-foreground truncate leading-tight">Arquiteturas</p>
          <p className="text-xs text-muted-foreground">de Computadores</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {sections.map((section, idx) => {
          const isOpen = openSections.has(idx);
          const hasActive = section.items.some(item =>
            item.path === location || (location === "/" && item.path === "/")
          );
          return (
            <div key={idx}>
              <button
                onClick={() => toggleSection(idx)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors text-left",
                  hasActive
                    ? "text-sidebar-primary"
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                {section.icon}
                <span className="flex-1 truncate">{section.label}</span>
                {isOpen ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-3 pb-1">
                      {section.items.map((item) => {
                        const isActive = item.path === location || (location === "/" && item.path === "/");
                        return (
                          <a
                            key={item.path}
                            href={`#${item.path}`}
                            onClick={onNavigate}
                            className={cn(
                              "block px-3 py-1.5 rounded-md text-sm transition-colors",
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                            )}
                          >
                            {item.label}
                          </a>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">35 tópicos · Guia Completo</p>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-card border border-border text-foreground"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      <aside className="hidden lg:flex w-64 flex-col h-full bg-sidebar border-r border-sidebar-border shrink-0">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-sidebar border-r border-sidebar-border lg:hidden"
            >
              <button
                className="absolute top-3 right-3 p-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
