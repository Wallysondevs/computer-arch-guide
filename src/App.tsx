import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

import Introducao from "@/pages/Introducao";
import RepresentacaoDados from "@/pages/RepresentacaoDados";
import AlgebraBooleana from "@/pages/AlgebraBooleana";
import CircuitosCombinacionais from "@/pages/CircuitosCombinacionais";
import CircuitosSequenciais from "@/pages/CircuitosSequenciais";

import OrganizacaoCPU from "@/pages/OrganizacaoCPU";
import CicloInstrucao from "@/pages/CicloInstrucao";
import ISA from "@/pages/ISA";
import ModosEnderecamento from "@/pages/ModosEnderecamento";
import Pipeline from "@/pages/Pipeline";

import HierarquiaMemoria from "@/pages/HierarquiaMemoria";
import Cache from "@/pages/Cache";
import MemoriaPrincipal from "@/pages/MemoriaPrincipal";
import MemoriaVirtual from "@/pages/MemoriaVirtual";
import Armazenamento from "@/pages/Armazenamento";

import SistemasIO from "@/pages/SistemasIO";
import Barramentos from "@/pages/Barramentos";
import InterrupcoesDMA from "@/pages/InterrupcoesDMA";
import Controladores from "@/pages/Controladores";

import CISCvsRISC from "@/pages/CISCvsRISC";
import ArquiteturaX86 from "@/pages/ArquiteturaX86";
import ArquiteturaARM from "@/pages/ArquiteturaARM";
import RISCV from "@/pages/RISCV";

import Superescalaridade from "@/pages/Superescalaridade";
import Multicore from "@/pages/Multicore";
import SIMD from "@/pages/SIMD";
import GPU from "@/pages/GPU";
import NUMA from "@/pages/NUMA";

import FPGA from "@/pages/FPGA";
import ASIC from "@/pages/ASIC";
import NPUTPU from "@/pages/NPUTPU";
import SoC from "@/pages/SoC";

import SegurancaHW from "@/pages/SegurancaHW";
import ComputacaoQuantica from "@/pages/ComputacaoQuantica";
import TendenciasFuturo from "@/pages/TendenciasFuturo";

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Introducao} />
      <Route path="/intro" component={Introducao} />
      <Route path="/dados" component={RepresentacaoDados} />
      <Route path="/booleana" component={AlgebraBooleana} />
      <Route path="/combinacional" component={CircuitosCombinacionais} />
      <Route path="/sequencial" component={CircuitosSequenciais} />

      <Route path="/cpu" component={OrganizacaoCPU} />
      <Route path="/ciclo" component={CicloInstrucao} />
      <Route path="/isa" component={ISA} />
      <Route path="/enderecamento" component={ModosEnderecamento} />
      <Route path="/pipeline" component={Pipeline} />

      <Route path="/hierarquia" component={HierarquiaMemoria} />
      <Route path="/cache" component={Cache} />
      <Route path="/dram" component={MemoriaPrincipal} />
      <Route path="/virtual" component={MemoriaVirtual} />
      <Route path="/armazenamento" component={Armazenamento} />

      <Route path="/io" component={SistemasIO} />
      <Route path="/barramentos" component={Barramentos} />
      <Route path="/interrupcoes" component={InterrupcoesDMA} />
      <Route path="/controladores" component={Controladores} />

      <Route path="/cisc-risc" component={CISCvsRISC} />
      <Route path="/x86" component={ArquiteturaX86} />
      <Route path="/arm" component={ArquiteturaARM} />
      <Route path="/riscv" component={RISCV} />

      <Route path="/superescalar" component={Superescalaridade} />
      <Route path="/multicore" component={Multicore} />
      <Route path="/simd" component={SIMD} />
      <Route path="/gpu" component={GPU} />
      <Route path="/numa" component={NUMA} />

      <Route path="/fpga" component={FPGA} />
      <Route path="/asic" component={ASIC} />
      <Route path="/npu-tpu" component={NPUTPU} />
      <Route path="/soc" component={SoC} />

      <Route path="/seguranca" component={SegurancaHW} />
      <Route path="/quantica" component={ComputacaoQuantica} />
      <Route path="/tendencias" component={TendenciasFuturo} />

      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Router />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <WouterRouter hook={useHashLocation}>
          <AppLayout />
        </WouterRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
