export default interface Race {
  raceName: string;
  date: string;
  time: string;
  Circuit: {
    circuitName: string;
    Location: {
      locality: string;
      country: string;
    };
  };
}
