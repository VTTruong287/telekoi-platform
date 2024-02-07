interface Array<T> {
  splitChunks (chunkSize: number): T[]
}

Array.prototype.splitChunks = function(chunkSize: number) {
  const chunks = [];
  for (let i = 0; i < this.length; i += chunkSize) {
    const chunk = this.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
}
