<script>
  import { valoresIniciales } from './config.js';

  let sueldoNetoBase = valoresIniciales.sueldoNetoBase; 
  let diasSemana = valoresIniciales.diasSemana;
  let horasDia = valoresIniciales.horasDia;
  let diasVacaciones = valoresIniciales.diasVacaciones;
  let festivosAlAno = valoresIniciales.festivosAlAno;
  let eficiencia = valoresIniciales.eficiencia; 

  let cuotaAutonomo = valoresIniciales.cuotaAutonomo; 
  let gestoria = valoresIniciales.gestoria;
  let alquiler = valoresIniciales.alquiler;
  let suministros = valoresIniciales.suministros;
  let licenciasSoftware = valoresIniciales.licenciasSoftware;
  let otrosGastos = valoresIniciales.otrosGastos;
  
  let valorEquiposTotal = valoresIniciales.valorEquiposTotal;
  let anosRenovacion = valoresIniciales.anosRenovacion;
  
  let irpf = valoresIniciales.irpf; 
  let margenBeneficio = valoresIniciales.margenBeneficio;
  let bolsaContingencia = valoresIniciales.bolsaContingencia;

  $: horasSemanales = diasSemana * horasDia;
  $: proporcionJornada = horasSemanales / 40; 
  $: sueldoNetoReal = sueldoNetoBase * proporcionJornada;

  $: diasLaborablesTeoricos = (diasSemana * 52.14);
  $: diasDescontar = diasVacaciones + festivosAlAno;
  $: diasRealesAno = diasLaborablesTeoricos - (diasDescontar * (diasSemana / 5));
  $: horasFacturablesAno = diasRealesAno * horasDia * (eficiencia / 100);

  $: amortizacionMensual = valorEquiposTotal / (anosRenovacion * 12);
  $: gastosFijosMensuales = cuotaAutonomo + gestoria + alquiler + suministros + licenciasSoftware + otrosGastos + amortizacionMensual;
  
  $: brutoMensualNecesario = (sueldoNetoReal / (1 - (irpf / 100))) + gastosFijosMensuales;
  $: brutoAnualNecesario = brutoMensualNecesario * 12;
  
  $: totalConMargenes = brutoAnualNecesario * (1 + (margenBeneficio / 100) + (bolsaContingencia / 100));
  $: precioHora = totalConMargenes / horasFacturablesAno;

  let horasProyecto = valoresIniciales.horasProyecto;
  let gastosTipografias = valoresIniciales.gastosTipografias;
  let gastosImagenes = valoresIniciales.gastosImagenes;
  let gastosHosting = valoresIniciales.gastosHosting;
  let gastosOtrosDirectos = valoresIniciales.gastosOtrosDirectos;
  
  $: gastosVariablesProyecto = gastosTipografias + gastosImagenes + gastosHosting + gastosOtrosDirectos;
  $: costeProyecto = (horasProyecto * precioHora) + gastosVariablesProyecto;
  $: costeProyectoIVA = costeProyecto * 1.21; 
</script>

<svelte:head>
  <title>Calculadora Freelance</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
</svelte:head>

<main class="min-h-screen p-6 md:p-10 flex flex-col">
  
  <div class="max-w-[1000px] mx-auto w-full flex-grow">
    
    <!-- CABECERA -->
    <header class="mb-10 pb-6 border-b border-[#ddd]">
      <h1 class="text-3xl md:text-4xl font-bold mb-2">Calculadora Freelance</h1>
      <p class="text-base text-[#666]">Descubre tu tarifa por hora real basándote en tus objetivos financieros,<br> gastos de estructura y tiempo de trabajo efectivo.</p>
    </header>

    <!-- BLOQUE 1: SUELDO Y TARIFA -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <section class="card">
        <div class="flex items-center gap-2 mb-2">
          <h2 class="text-xl font-bold">Sueldo neto</h2>
          <div class="tooltip-icon w-5 h-5 text-xs">
            ?
            <div class="tooltip-bridge">
              <div class="tooltip-box text-sm">El dinero estimado que ganarás como sueldo a final de mes.</div>
            </div>
          </div>
        </div>
        <p class="text-sm text-[#666] mb-6">Trabajando a jornada completa<br>(8 horas diarias, 5 días a la semana)</p>
        
        <input type="number" bind:value={sueldoNetoBase} class="input-large mb-4">
        
        {#if proporcionJornada < 1}
          <div class="p-5 bg-[#EDEDED] border border-[#ccc] rounded">
            <p class="text-sm text-[#666] mb-1">Sueldo ajustado a tus <strong>{horasSemanales}h</strong> semanales:</p>
            <p class="text-3xl font-bold">{sueldoNetoReal.toFixed(0)}€<span class="text-lg font-normal text-[#666]">/mes</span></p>
          </div>
        {/if}
      </section>

      <section class="bg-black text-white border border-black p-6 rounded-[8px] shadow-[0_5px_15px_rgba(0,0,0,0.1)] flex flex-col justify-center items-center text-center transition-all hover:-translate-y-1">
        <p class="text-[#ccc] font-bold tracking-widest text-sm mb-4">TARIFA RECOMENDADA</p>
        <div class="text-6xl md:text-7xl font-bold">{precioHora.toFixed(2)}€<span class="text-2xl font-normal text-[#888]">/h</span></div>
        <div class="mt-6 pt-4 border-t border-[#333] flex justify-center gap-4 text-xs text-[#888] w-full">
          <span>Días/año: <strong class="text-white">{Math.round(diasRealesAno)}</strong></span>
          <span>|</span>
          <span>Horas/año: <strong class="text-white">{Math.round(horasFacturablesAno)}</strong></span>
        </div>
      </section>
    </div>

    <!-- BLOQUE 2: DISPONIBILIDAD Y GASTOS -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <section class="card">
        <h3 class="text-lg font-bold mb-6 border-b border-[#ddd] pb-2">Disponibilidad real</h3>
        <div class="grid grid-cols-2 gap-4">
          <label>
            <span class="label-title">Días/semana</span>
            <input type="number" bind:value={diasSemana} class="input-field">
          </label>
          <label>
            <span class="label-title">Horas/día</span>
            <input type="number" bind:value={horasDia} class="input-field">
          </label>
          <label>
            <div class="flex items-center gap-2 mb-1">
              <span class="label-title mb-0">Vacaciones</span>
              <div class="tooltip-icon w-4 h-4 text-[10px]">
                ?
                <div class="tooltip-bridge w-56">
                  <div class="tooltip-box">Un asalariado medio en España tiene 22 días laborables de vacaciones (que junto a los fines de semana son un mes).</div>
                </div>
              </div>
            </div>
            <input type="number" bind:value={diasVacaciones} class="input-field">
          </label>
          <label>
            <div class="flex items-center gap-2 mb-1">
              <span class="label-title mb-0">Festivos</span>
              <div class="tooltip-icon w-4 h-4 text-[10px]">
                ?
                <div class="tooltip-bridge w-56">
                  <div class="tooltip-box">Navidades, Semana Santa, festivos nacionales, regionales y municipales.</div>
                </div>
              </div>
            </div>
            <input type="number" bind:value={festivosAlAno} class="input-field">
          </label>
          <label class="col-span-2 mt-2">
            <div class="flex items-center gap-2 mb-1">
              <span class="label-title mb-0">Factor Eficiencia (%)</span>
              <div class="tooltip-icon w-4 h-4 text-[10px]">
                ?
                <div class="tooltip-bridge w-64">
                  <div class="tooltip-box">Porcentaje de tiempo realmente facturable. El resto son tareas de gestión, emails, reuniones previas o formación.</div>
                </div>
              </div>
            </div>
            <input type="number" bind:value={eficiencia} class="input-field">
          </label>
        </div>
      </section>

      <section class="card">
        <h3 class="text-lg font-bold mb-6 border-b border-[#ddd] pb-2">Gastos e impuestos</h3>
        <div class="grid grid-cols-2 gap-x-4 gap-y-4">
          <label>
            <div class="flex items-center gap-1 mb-1">
              <span class="label-small mb-0">Cuota Autónomo</span>
              <div class="tooltip-icon w-3 h-3 text-[8px]">
                ?
                <div class="tooltip-bridge w-56">
                  <div class="tooltip-box">Los primeros años con la tarifa plana puede ser cero dependiendo de la comunidad autónoma.</div>
                </div>
              </div>
            </div>
            <input type="number" bind:value={cuotaAutonomo} class="input-field">
          </label>
          <label>
            <span class="label-small">Gestoría</span>
            <input type="number" bind:value={gestoria} class="input-field">
          </label>
          <label>
            <span class="label-small">Local / Coworking</span>
            <input type="number" bind:value={alquiler} class="input-field">
          </label>
          <label>
            <div class="flex items-center gap-1 mb-1">
              <span class="label-small mb-0">Suministros</span>
              <div class="tooltip-icon w-3 h-3 text-[8px]">
                ?
                <div class="tooltip-bridge w-56">
                  <div class="tooltip-box">Luz, agua, internet. Si la oficina está en tu casa, calcula solo el porcentaje proporcional al espacio destinado a la oficina.</div>
                </div>
              </div>
            </div>
            <input type="number" bind:value={suministros} class="input-field">
          </label>
          <label>
            <span class="label-small">Licencias y Suscripciones</span>
            <input type="number" bind:value={licenciasSoftware} class="input-field">
          </label>
          <label>
            <span class="label-small">Otros</span>
            <input type="number" bind:value={otrosGastos} class="input-field">
          </label>

          <div class="col-span-2 mt-2">
            <div class="flex items-center gap-1 mb-1">
              <span class="label-small mb-0">Amortización de equipos</span>
              <div class="tooltip-icon w-3 h-3 text-[8px]">
                ?
                <div class="tooltip-bridge w-64">
                  <div class="tooltip-box">Suma el valor de tus equipos (ordenador, tableta, monitores) y los años que tardas en renovarlos para ahorrar mes a mes su coste.</div>
                </div>
              </div>
            </div>
            <div class="flex items-center border border-[#ccc] rounded focus-within:border-black transition-colors overflow-hidden">
              <div class="flex-1 flex items-center bg-white px-3">
                <span class="text-[10px] text-[#ccc] font-bold uppercase tracking-wider mr-2">Valor(€)</span>
                <input type="number" bind:value={valorEquiposTotal} class="w-full py-2 outline-none text-sm">
              </div>
              <div class="w-px h-6 bg-[#ccc]"></div>
              <div class="flex-1 flex items-center bg-white px-3">
                <span class="text-[10px] text-[#ccc] font-bold uppercase tracking-wider mr-2">Años</span>
                <input type="number" bind:value={anosRenovacion} class="w-full py-2 outline-none text-sm">
              </div>
            </div>
          </div>

          <label class="col-span-2 mt-2">
            <div class="flex items-center gap-2 mb-1">
              <span class="label-small mb-0">IRPF Estimado (%)</span>
              <div class="tooltip-icon w-4 h-4 text-[10px]">
                ?
                <div class="tooltip-bridge w-64">
                  <div class="tooltip-box">Retención estimada para unos ingresos netos de {sueldoNetoReal.toFixed(0)}€. <a href="https://www2.agenciatributaria.gob.es/wlpl/PRET-R200/R260/index.zul" target="_blank" class="text-blue-300 underline hover:text-blue-100">Calcula tu tramo en Hacienda</a>.</div>
                </div>
              </div>
            </div>
            <input type="number" bind:value={irpf} class="input-field">
          </label>

          <label class="mt-2">
            <div class="flex items-center gap-1 mb-1">
              <span class="label-small mb-0">Beneficio %</span>
              <div class="tooltip-icon w-3 h-3 text-[8px]">
                ?
                <div class="tooltip-bridge w-64">
                  <div class="tooltip-box">Ganancia para la empresa (distinta a tu sueldo). Se usa para invertir en el propio negocio, formaciones extra o expansión.</div>
                </div>
              </div>
            </div>
            <input type="number" bind:value={margenBeneficio} class="input-field">
          </label>
          <label class="mt-2">
            <div class="flex items-center gap-1 mb-1">
              <span class="label-small mb-0">Contingencia %</span>
              <div class="tooltip-icon w-3 h-3 text-[8px]">
                ?
                <div class="tooltip-bridge w-64">
                  <div class="tooltip-box">Fondo de emergencia para cubrir épocas sin clientes, enfermedad prolongada o aportaciones a la jubilación.</div>
                </div>
              </div>
            </div>
            <input type="number" bind:value={bolsaContingencia} class="input-field">
          </label>
        </div>
      </section>
    </div>

    <!-- BLOQUE 3: PRESUPUESTO PROYECTO -->
    <section class="card p-8">
      <h2 class="text-2xl font-bold mb-6">Presupuesto por Proyecto</h2>
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <label class="w-full md:w-1/4">
          <span class="label-title">Horas estimadas</span>
          <input type="number" bind:value={horasProyecto} class="input-field text-xl font-bold p-3">
        </label>
        
        <div class="w-full md:w-2/4">
          <span class="label-title">Gastos directos extras</span>
          <div class="grid grid-cols-2 gap-3">
            <label>
              <span class="text-[10px] uppercase font-bold text-[#ccc] block mb-1">Tipografías</span>
              <input type="number" bind:value={gastosTipografias} class="input-field">
            </label>
            <label>
              <span class="text-[10px] uppercase font-bold text-[#ccc] block mb-1">Fotos/Ilustración</span>
              <input type="number" bind:value={gastosImagenes} class="input-field">
            </label>
            <label>
              <span class="text-[10px] uppercase font-bold text-[#ccc] block mb-1">Hosting/Dominios</span>
              <input type="number" bind:value={gastosHosting} class="input-field">
            </label>
            <label>
              <span class="text-[10px] uppercase font-bold text-[#ccc] block mb-1">Otros</span>
              <input type="number" bind:value={gastosOtrosDirectos} class="input-field">
            </label>
          </div>
        </div>
        
        <div class="w-full md:w-1/4 p-5 border border-black bg-black text-white text-right rounded-[4px] self-stretch flex flex-col justify-center">
          <p class="text-[#ccc] text-[10px] font-bold tracking-widest">TOTAL (SIN IVA)</p>
          <p class="text-3xl font-bold mt-1">{costeProyecto.toFixed(2)}€</p>
          <div class="mt-4 pt-3 border-t border-[#333]">
            <p class="text-[#ccc] text-[10px] font-bold tracking-widest">TOTAL CON IVA (21%)</p>
            <p class="text-xl font-bold mt-1 text-[#888]">{costeProyectoIVA.toFixed(2)}€</p>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div class="mt-20 border-t border-[#ddd] pt-10 pb-6 text-center text-[12px] text-[#888]">
    <p class="m-0 tracking-[0.5px]">
      © 2026 Iván Huelves Illas – 
      <a href="https://github.com/ivan-huelves" target="_blank" rel="noopener noreferrer" class="text-[#444] no-underline border-b border-[#ccc] transition-all hover:text-black hover:border-black pb-0.5">GitHub</a> – 
      <a href="#" target="_blank" rel="noopener noreferrer" class="text-[#444] no-underline border-b border-[#ccc] transition-all hover:text-black hover:border-black pb-0.5">LinkedIn</a> – 
      <span class="email-protector" style="unicode-bidi: bidi-override; direction: rtl; display: inline-block; color: #444;">se.dirdamdsed@sevleuhi</span>
    </p>
  </div>
</main>