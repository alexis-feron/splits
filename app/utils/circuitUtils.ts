export function getCircuitImage(circuitId: string): string {
  // Using local circuit images stored in public/circuits/
  // Map of circuit IDs to local SVG files
  const circuitMap: { [key: string]: string } = {
    bahrain: "/circuits/bahrain.svg",
    jeddah: "/circuits/jeddah.svg",
    albert_park: "/circuits/melbourne.svg",
    suzuka: "/circuits/suzuka.svg",
    shanghai: "/circuits/shanghai.svg",
    miami: "/circuits/miami.svg",
    imola: "/circuits/imola.svg",
    monaco: "/circuits/monaco.svg",
    villeneuve: "/circuits/montreal.svg",
    catalunya: "/circuits/barcelona.svg",
    red_bull_ring: "/circuits/spielberg.svg",
    silverstone: "/circuits/silverstone.svg",
    hungaroring: "/circuits/hungaroring.svg",
    spa: "/circuits/spa.svg",
    zandvoort: "/circuits/zandvoort.svg",
    monza: "/circuits/monza.svg",
    baku: "/circuits/baku.svg",
    marina_bay: "/circuits/singapore.svg",
    americas: "/circuits/austin.svg",
    rodriguez: "/circuits/mexico.svg",
    interlagos: "/circuits/interlagos.svg",
    vegas: "/circuits/las_vegas.svg",
    losail: "/circuits/losail.svg",
    yas_marina: "/circuits/yas_marina.svg",
  };

  return circuitMap[circuitId] || "/circuits/default.svg";
}

export function formatSessionTime(
  dateString: string,
  timeString: string
): string {
  try {
    const dateTime = new Date(`${dateString}T${timeString}`);
    return dateTime.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch (error) {
    return `${dateString} ${timeString} : ${error}`;
  }
}
