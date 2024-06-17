import {LinkServer} from './nativeModules';
import type {content, Message} from './linkServer';
import {Buffer} from 'buffer';
import {clamp, asyncSleep, xor8} from './utils';
const MINIFPV_FLYCTRL_CENTER = 0x80;
const MINIFPV_FLYCTRL_RANGE = 0x60;

enum Command {
  terminate = 'terminate',
  takeoff = 'takeoff',
  calibrating = 'calibrating',
  up = 'up',
  down = 'down',
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  cw = 'cw',
  ccw = 'ccw',
  roll = 'roll',
  movetoxyz = 'movetoxyz',
}

interface IFlightControls {
  roll: number;
  pitch: number;
  acc: number;
  yaw: number;
  ctrl: number;
}

class MiniFPV implements IFlightControls {
  linkServer: any;
  private host: string;
  private port: number;
  private HEAD: number[] = [0x66, 0x14];
  private END: number[] = [0x99];
  private BODY_FILL: number[] = [
    0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  ];
  roll: number = MINIFPV_FLYCTRL_CENTER;
  pitch: number = MINIFPV_FLYCTRL_CENTER;
  acc: number = MINIFPV_FLYCTRL_CENTER;
  yaw: number = MINIFPV_FLYCTRL_CENTER;
  ctrl: number = 0x00;

  constructor(host: string, port: number) {
    this.linkServer = LinkServer;
    this.host = host;
    this.port = port;
    this.init();
  }

  init() {
    setInterval(() => {
      this.sendMessage();
    }, 50);
  }

  sendMessage() {
    const CTRL_BODY = [this.roll, this.pitch, this.acc, this.yaw, this.ctrl];
    const ck = xor8([...CTRL_BODY, ...this.BODY_FILL]);
    const data: number[] = [
      ...this.HEAD,
      ...CTRL_BODY,
      ...this.BODY_FILL,
      ck,
      ...this.END,
    ];
    //console.log(data.map(byte => byte.toString(16)));
    const base64Data = Buffer.from(data).toString('base64');
    try {
      this.linkServer.sendUDPMessage(base64Data, this.host, this.port);
    } catch (err) {
      console.error('UDP SEND MESSAGE ERROR', err);
    }
  }
  setRoll(roll: number) {
    this.roll = roll;
  }
  setPitch(pitch: number) {
    this.pitch = pitch;
  }
  setAcc(acc: number) {
    this.acc = acc;
  }
  setYaw(yaw: number) {
    this.yaw = yaw;
  }
  setCtrl(ctrl: number) {
    this.ctrl = ctrl;
  }

  reset() {
    this.roll = MINIFPV_FLYCTRL_CENTER;
    this.pitch = MINIFPV_FLYCTRL_CENTER;
    this.acc = MINIFPV_FLYCTRL_CENTER;
    this.yaw = MINIFPV_FLYCTRL_CENTER;
    this.ctrl = 0x00;
  }

  async notify(content: content) {
    const {cmd, arg, arg1, arg2, arg3} = content;
    console.log('minifpv收到消息', content);
    switch (cmd) {
      case Command.terminate:
        await this.terminate();
        break;
      case Command.takeoff:
        await this.takeoff();
        break;
      case Command.calibrating:
        await this.calibrating();
        break;
      case Command.up:
        await this.up(arg, arg1);
        break;
      case Command.down:
        await this.down(arg, arg1);
        break;
      case Command.forward:
        await this.forward(arg, arg1);
        break;
      case Command.back:
        await this.back(arg, arg1);
        break;
      case Command.left:
        await this.left(arg, arg1);
        break;
      case Command.right:
        await this.right(arg, arg1);
        break;
      case Command.cw:
        await this.cw(arg, arg1);
        break;
      case Command.ccw:
        await this.ccw(arg, arg1);
        break;
      case Command.roll:
        await this.rollCtrl(arg);
        break;
      case Command.movetoxyz:
        // await this.movetoxyz(arg, arg1, arg2, arg3, arg4);
        break;
      default:
        break;
    }
  }

  async terminate() {
    this.setCtrl(0x02);
    await asyncSleep(1000);
    this.setCtrl(0x00);
  }

  async takeoff() {
    this.setCtrl(0x01);
    await asyncSleep(1000);
    this.setCtrl(0x00);
  }

  async calibrating() {
    this.setCtrl(0x04);
    await asyncSleep(1000);
    this.setCtrl(0x00);
  }

  async up(arg: any, arg1: any) {
    const power = parseInt(arg);
    const delay = parseInt(arg1);
    const acc =
      MINIFPV_FLYCTRL_CENTER +
      parseInt(String((MINIFPV_FLYCTRL_RANGE * clamp(power, 0, 100)) / 100));
    this.setAcc(acc);
    await asyncSleep(delay * 1000);
    this.reset();
  }

  async down(arg: any, arg1: any) {
    const power = parseInt(arg);
    const delay = parseInt(arg1);
    const acc =
      MINIFPV_FLYCTRL_CENTER -
      parseInt(String((MINIFPV_FLYCTRL_RANGE * clamp(power, 0, 100)) / 100));
    this.setAcc(acc);
    await asyncSleep(delay * 1000);
    this.reset();
  }

  async forward(arg: any, arg1: any) {
    const power = parseInt(arg);
    const delay = parseInt(arg1);
    const pitch =
      MINIFPV_FLYCTRL_CENTER +
      parseInt(String((MINIFPV_FLYCTRL_RANGE * clamp(power, 0, 100)) / 100));
    this.setPitch(pitch);
    await asyncSleep(delay * 1000);
    this.reset();
  }

  async back(arg: any, arg1: any) {
    const power = parseInt(arg);
    const delay = parseInt(arg1);
    const pitch =
      MINIFPV_FLYCTRL_CENTER -
      parseInt(String((MINIFPV_FLYCTRL_RANGE * clamp(power, 0, 100)) / 100));
    this.setPitch(pitch);
    await asyncSleep(delay * 1000);
    this.reset();
  }
  async left(arg: any, arg1: any) {
    const power = parseInt(arg);
    const delay = parseInt(arg1);
    const roll =
      MINIFPV_FLYCTRL_CENTER -
      parseInt(String((MINIFPV_FLYCTRL_RANGE * clamp(power, 0, 100)) / 100));
    this.setRoll(roll);
    await asyncSleep(delay * 1000);
    this.reset();
  }

  async right(arg: any, arg1: any) {
    const power = parseInt(arg);
    const delay = parseInt(arg1);
    const roll =
      MINIFPV_FLYCTRL_CENTER +
      parseInt(String((MINIFPV_FLYCTRL_RANGE * clamp(power, 0, 100)) / 100));
    this.setRoll(roll);
    await asyncSleep(delay * 1000);
    this.reset();
  }
  async cw(arg: any, arg1: any) {
    const power = parseInt(arg);
    const delay = parseInt(arg1);
    const yaw =
      MINIFPV_FLYCTRL_CENTER +
      parseInt(String((MINIFPV_FLYCTRL_RANGE * clamp(power, 0, 100)) / 100));
    this.setYaw(yaw);
    await asyncSleep(delay * 1000);
    this.reset();
  }

  async ccw(arg: any, arg1: any) {
    const power = parseInt(arg);
    const delay = parseInt(arg1);
    const yaw =
      MINIFPV_FLYCTRL_CENTER -
      parseInt(String((MINIFPV_FLYCTRL_RANGE * clamp(power, 0, 100)) / 100));
    this.setYaw(yaw);
    await asyncSleep(delay * 1000);
    this.reset();
  }
  async rollCtrl(arg: any) {
    this.setCtrl(0x08);
    await asyncSleep(1000);
    this.setCtrl(0x00);
    switch (arg) {
      case 'back':
        this.setPitch(0x60);
        break;
      case 'left':
        this.setRoll(0x60);
        break;
      case 'right':
        this.setRoll(0xa0);
        break;
      default:
        this.setPitch(0xa0);
        break;
    }
  }

  async movetoxyz(roll: any, pitch: any, acc: any, yaw: any, delay: any) {}
}

export default MiniFPV;

export type {Message};
