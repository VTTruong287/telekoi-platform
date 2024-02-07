interface BigInt {
  toJSON();
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};
