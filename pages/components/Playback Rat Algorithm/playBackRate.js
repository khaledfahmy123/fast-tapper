let VR = 1;
let PTR = 0;
let RTR = 3;
let k;
let speed = -1;
let active = rev;

const rateCalc = () => {
  cps.current.innerHTML = 2 * PTR + "CSP";
  k = PTR / RTR;
  speed = -VR + k * VR;
  speed = speed >= 10 ? 10 : speed;
  speed = speed <= -3 ? -3 : speed;
  setIsNegative(speed < 0);
  PTR = 0;
  return speed;
};
