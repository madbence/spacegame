import {mkThruster} from './utils';

export default [{
  hull: 100,
  thrusters: [
    mkThruster([0, -5], 0, .5),
    mkThruster([0, 5], Math.PI, .5),
    mkThruster([5, -4], Math.PI / 2, .05),
    mkThruster([-5, -4], -Math.PI / 2, .05),
  ],
}];
