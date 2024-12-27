class DateTimeService {
    timeDelta(hora1: string, hora2: string): string {
        // Converter horas e minutos de strings para números
        const [h1, m1] = hora1.split(":").map(Number);
        const [h2, m2] = hora2.split(":").map(Number);
    
        // Transformar tudo em minutos
        const minutos1 = h1 * 60 + m1;
        const minutos2 = h2 * 60 + m2;
    
        // Calcular a diferença em minutos
        const diferencaMinutos = Math.abs(minutos2 - minutos1);
    
        // Converter de volta para horas e minutos
        const horas = Math.floor(diferencaMinutos / 60);
        const minutos = diferencaMinutos % 60;
    
        // Retornar no formato HH:mm
        return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
      }
    
      timeSum(listaDeTempos: string[]): string {
        let totalMinutos = 0;
    
        // Somar todos os tempos em minutos
        listaDeTempos.forEach((tempo) => {
          const [horas, minutos] = tempo.split(":").map(Number);
          totalMinutos += horas * 60 + minutos;
        });
    
        // Converter o total de minutos para horas e minutos
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;
    
        // Retornar no formato HH:mm
        return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
      }
}

export default new DateTimeService();