import { AnimSprite } from "./animsprite";
import { Tile } from "./tiles";
import { Consts } from "./constants";

export class Player extends AnimSprite {
  constructor(engine, tx, ty) {
    super(
      Consts.ObjectPlayer,
      engine,
      "img_dona",
      tx,
      ty,
      48,
      64,
      -10,
      -32,
      2,
      2,
      false
    );
    this.speed = 2;
    this.direction = 1;
    this.state = 0; //standing top right down left
    this.moving = false;
    this.tileWidth = Consts.TileWidth;
    this.tileHeight = Consts.TileWidth;
    this.animDelay = 3;
    this.counter = 0;
    this.fallCounter = 0;
    this.innerCounter = 0;
    this.standCounter = 0;
    this.intro();
  }

  left() {
    if (!this.moving) {
      //if standing then turn
      if (this.direction !== Consts.DirLeft) {
        //is not under a brick
        if (!Tile.isSolid(this.corners.u)) {
          this.setAnim(
            Consts.AnimTurnStart,
            Consts.AnimTurnEnd,
            false,
            Consts.AnimRightRow,
            4
          );
        } else {
          this.setAnim(
            Consts.AnimCrouchStart,
            Consts.AnimCrouchStart,
            false,
            Consts.AnimLeftRow,
            4
          );
        }
        this.setState(Consts.MoveTurn, true);
        this.direction = Consts.DirLeft;
      } else {
        //running
        if (!Tile.isSolid(this.corners.l) && Tile.isSolid(this.corners.d)) {
          //not under a brick
          if (!Tile.isSolid(this.corners.u) && !Tile.isSolid(this.corners.ul)) {
            this.setAnim(
              Consts.AnimRunStart,
              Consts.AnimRunEnd,
              true,
              Consts.AnimLeftRow,
              2
            );
          } else {
            this.setAnim(
              Consts.AnimCrouchStart,
              Consts.AnimCrouchEnd,
              true,
              Consts.AnimLeftRow,
              2
            );
          }
          this.setState(Consts.MoveLeft, true);
        }
        //hit an ice
        if (
          Tile.isSolid(this.corners.d) &&
          (this.corners.l === Consts.ObjectIce ||
            this.corners.l === Consts.ObjectMetal)
        ) {
          this.push();
        }
        //climb
        if (
          Tile.isSolid(this.corners.l) &&
          Tile.isSolid(this.corners.d) &&
          !Tile.isSolid(this.corners.u) &&
          !Tile.isSolid(this.corners.ul) &&
          !this.moving
        ) {
          this.setAnim(
            Consts.AnimPushStart,
            Consts.AnimPushStart,
            false,
            Consts.AnimLeftRow
          );
          this.setState(Consts.MoveUp, true);
        }
      }
    }
  }

  right() {
    if (!this.moving) {
      if (this.direction !== Consts.DirRight) {
        if (!Tile.isSolid(this.corners.u)) {
          this.setAnim(
            Consts.AnimTurnStart,
            Consts.AnimTurnEnd,
            false,
            Consts.AnimLeftRow,
            4
          );
        } else {
          this.setAnim(
            Consts.AnimCrouchStart,
            Consts.AnimCrouchStart,
            false,
            Consts.AnimRightRow,
            4
          );
        }
        this.setState(Consts.MoveTurn, true);
        this.direction = Consts.DirRight;
      } else {
        if (!Tile.isSolid(this.corners.r) && Tile.isSolid(this.corners.d)) {
          if (!Tile.isSolid(this.corners.u) && !Tile.isSolid(this.corners.ur)) {
            this.setAnim(
              Consts.AnimRunStart,
              Consts.AnimRunEnd,
              true,
              Consts.AnimRightRow,
              2
            );
          } else {
            this.setAnim(
              Consts.AnimCrouchStart,
              Consts.AnimCrouchEnd,
              true,
              Consts.AnimRightRow,
              2
            );
          }
          this.setState(Consts.MoveRight, true);
        }
        if (
          Tile.isSolid(this.corners.d) &&
          (this.corners.r === Consts.ObjectIce ||
            this.corners.r === Consts.ObjectMetal)
        ) {
          this.push();
        }
        if (
          Tile.isSolid(this.corners.r) &&
          Tile.isSolid(this.corners.d) &&
          !Tile.isSolid(this.corners.u) &&
          !Tile.isSolid(this.corners.ur) &&
          !this.moving
        ) {
          this.setAnim(
            Consts.AnimPushStart,
            Consts.AnimPushStart,
            false,
            Consts.AnimRightRow
          );
          this.setState(Consts.MoveUp, true);
        }
      }
    }
  }

  burn() {
    if (this.state !== Consts.MoveRip) {
      this.engine.sound.playOnce("danger");
      this.setState(Consts.MoveRip, true);
      this.setAnim(
        Consts.AnimRipStart,
        Consts.AnimRipEnd,
        true,
        Consts.AnimRightRow
      );
    }
  }

  intro() {
    this.setAnim(
      Consts.AnimBigFallStart,
      Consts.AnimBigFallEnd,
      true,
      Consts.AnimRightRow,
      4
    );
    this.setState(Consts.MoveLevelEnter, true);
  }

  outro() {
    this.setAnim(
      Consts.AnimFallStart,
      Consts.AnimBigFallEnd,
      true,
      Consts.AnimRightRow,
      4
    );
    this.setState(Consts.MoveLevelExit, true);
    this.innerCounter = 0;
  }

  doRip() {}

  gravity() {
    if (!this.moving) {
      if (typeof this.corners.d === "undefined") {
        console.eror("undefined corner");
      }
      if (!Tile.isSolid(this.corners.d)) {
        this.setState(Consts.MoveDown, true);
        if (this.fallCounter >= 1) {
          this.engine.sound.playOnce("falling");
          this.setAnim(
            Consts.AnimBigFallStart,
            Consts.AnimBigFallEnd,
            true,
            Consts.AnimRightRow,
            1
          );
        } else {
          this.setAnim(
            Consts.AnimBigFallStart,
            Consts.AnimBigFallEnd,
            true,
            Consts.AnimRightRow,
            3
          );
        }
      } else {
        this.engine.sound.stop("falling");
        if (this.state === Consts.MoveDown) {
          this.engine.sound.play("fall");
          this.engine.addSparks(
            this.xTile,
            this.yTile,
            "124, 238, 66",
            10,
            0.75
          );
          this.engine.addSparks(
            this.xTile,
            this.yTile + 1,
            "122, 211, 255",
            5,
            1.25
          );
        }
        this.fallCounter = 0;
        this.setState(Consts.MoveStand, false);
        if (this.corners.d === Consts.ObjectJar) {
          const jar = this.engine.spriteAt(this.xTile, this.yTile + 1);
          if (jar && jar.onFire) {
            this.burn();
          }
        }
      }
    }
  }

  ice() {
    if (!this.moving) {
      if (Tile.isSolid(this.corners.d)) {
        if (this.direction === Consts.DirRight) {
          if (
            !Tile.isSolid(this.corners.dr) &&
            this.corners.dr !== Consts.ObjectFire
          ) {
            this.setAnim(
              Consts.AnimIceStart,
              Consts.AnimIceEnd,
              false,
              Consts.AnimRightRow,
              4
            );
            this.setState(Consts.MoveIceMake, true);
          } else if (this.corners.dr === Consts.ObjectIce) {
            this.setAnim(
              Consts.AnimIceStart,
              Consts.AnimIceEnd,
              false,
              Consts.AnimRightRow,
              4
            );
            this.setState(Consts.MoveIceRemove, true);
          } else {
            this.setAnim(
              Consts.AnimIceStart,
              Consts.AnimIceEnd,
              false,
              Consts.AnimRightRow,
              4
            );
            this.setState(Consts.MoveIceFail, true);
          }
        } else {
          if (
            !Tile.isSolid(this.corners.dl) &&
            this.corners.dl !== Consts.ObjectFire
          ) {
            this.setAnim(
              Consts.AnimIceStart,
              Consts.AnimIceEnd,
              false,
              Consts.AnimLeftRow,
              4
            );
            this.setState(Consts.MoveIceMake, true);
          } else if (this.corners.dl === Consts.ObjectIce) {
            this.setAnim(
              Consts.AnimIceStart,
              Consts.AnimIceEnd,
              false,
              Consts.AnimLeftRow,
              4
            );
            this.setState(Consts.MoveIceRemove, true);
          } else {
            this.setAnim(
              Consts.AnimIceStart,
              Consts.AnimIceEnd,
              false,
              Consts.AnimLeftRow,
              4
            );
            this.setState(Consts.MoveIceFail, true);
          }
        }
      }
    }
  }

  jump() {
    if (!this.moving) {
      if (this.direction === Consts.DirRight) {
        if (
          Tile.isSolid(this.corners.r) &&
          !Tile.isSolid(this.corners.ur) &&
          !Tile.isSolid(this.corners.u)
        ) {
          this.setAnim(
            Consts.AnimPushStart,
            Consts.AnimPushStart,
            false,
            Consts.AnimRightRow
          );
          this.setState(Consts.MoveUp, true);
        }
      } else {
        if (
          Tile.isSolid(this.corners.l) &&
          !Tile.isSolid(this.corners.ul) &&
          !Tile.isSolid(this.corners.u)
        ) {
          this.setAnim(
            Consts.AnimPushStart,
            Consts.AnimPushStart,
            false,
            Consts.AnimLeftRow
          );
          this.setState(Consts.MoveUp, true);
        }
      }
    }
  }

  doRun() {
    this.counter += 1;
    if (this.counter <= Consts.AnimFrameCount) {
      this.x += this.speed * this.direction;
    } else {
      this.setState(Consts.MoveStand, false);
    }
  }

  doTurn() {
    this.counter += 1;
    if (this.counter >= Consts.AnimFrameCount) {
      this.setState(Consts.MoveStand, false);
    }
  }

  doOutro() {
    this.counter += 1;
    if (this.counter % 10 === 0) {
      this.innerCounter += 1;
      if (this.innerCounter === 1) {
        this.engine.addSparks(this.xTile, this.yTile, "124, 238, 66", 25, 0.5);
      }
      if (this.innerCounter === 3) {
        this.engine.addSparks(this.xTile, this.yTile, "255, 135, 124", 30, 1);
      }
      if (this.innerCounter === 5) {
        this.engine.addSparks(this.xTile, this.yTile, "122, 211, 255", 35, 1.5);
      }
      if (this.innerCounter % 2 === 0 && this.innerCounter < 6) {
        this.engine.sound.play("climb");
      }
    }
    if (this.innerCounter % 2 === 1) {
      this.y += 1;
    } else {
      this.y -= 1;
    }
    if (this.innerCounter >= 6) {
      this.engine.sound.play("state-leave");
      this.setState(Consts.MoveStand, false);
      this.engine.nextLevel();
    }
  }

  doIntro() {
    this.counter += 1;
    if (this.counter === 8) {
      this.engine.addSparks(this.xTile, this.yTile, "124, 238, 66", 20, 2.5);
      this.engine.addSparks(this.xTile, this.yTile, "255, 135, 124", 35, 1);
      this.engine.addSparks(this.xTile, this.yTile, "122, 211, 255", 20, 1.5);
      this.engine.sound.play("stage-enter");
    }
    if (this.counter >= 32) {
      this.engine.sound.stop("falling");
      this.setState(Consts.MoveStand, false);
    }
  }

  doGravity() {
    this.counter += 1;
    if (this.counter <= Consts.AnimFrameCount) {
      this.y += this.speed;
    } else {
      this.moving = false;
      this.gravity();
      this.fallCounter++;
    }
  }

  doStand() {
    if (!Tile.isSolid(this.corners.u)) {
      if (this.standCounter++ > 500) {
        this.setAnim(
          Consts.AnimSleepStart,
          Consts.AnimSleepEnd,
          true,
          this.direction !== 1 ? Consts.AnimLeftRow : Consts.AnimRightRow,
          48,
          true
        );
      } else {
        this.setAnim(
          Consts.AnimStandStart,
          Consts.AnimStandEnd,
          true,
          this.direction !== 1 ? Consts.AnimLeftRow : Consts.AnimRightRow,
          8,
          true
        );
      }
    } else {
      this.setAnim(
        Consts.AnimCrouchStart,
        Consts.AnimCrouchStart,
        false,
        this.direction !== 1 ? Consts.AnimLeftRow : Consts.AnimRightRow,
        8,
        true
      );
    }
  }

  doUp() {
    this.counter += 1;
    if (this.counter <= 18) {
      switch (this.counter) {
        case 3:
          this.engine.sound.play("climb");
          this.engine.addSparks(
            this.xTile,
            this.yTile,
            "124, 238, 66",
            10,
            0.75
          );
          this.engine.addSparks(
            this.xTile,
            this.yTile,
            "255, 135, 124",
            5,
            1.25
          );
          this.setAnim(
            Consts.AnimPushEnd,
            Consts.AnimPushEnd,
            false,
            this.direction === Consts.DirRight
              ? Consts.AnimRightRow
              : Consts.AnimLeftRow
          );
          break;
        case 6:
          this.setAnim(
            Consts.AnimJumpStart,
            Consts.AnimJumpStart,
            false,
            this.direction === Consts.DirRight
              ? Consts.AnimRightRow
              : Consts.AnimLeftRow
          );
          this.x += 8 * this.direction;
          this.y -= 8;
          break;
        case 9:
          this.setAnim(
            Consts.AnimJumpEnd,
            Consts.AnimJumpEnd,
            false,
            this.direction === Consts.DirRight
              ? Consts.AnimRightRow
              : Consts.AnimLeftRow
          );
          this.x += 8 * this.direction;
          this.y -= 8;
          break;
        case 12:
          this.setAnim(
            2,
            2,
            false,
            this.direction === Consts.DirRight
              ? Consts.AnimRightRow
              : Consts.AnimLeftRow
          );
          this.x += 8 * this.direction;
          this.y -= 8;
          break;
        case 18:
          this.setAnim(
            Consts.AnimStand,
            Consts.AnimStand,
            false,
            this.direction === Consts.DirRight
              ? Consts.AnimRightRow
              : Consts.AnimLeftRow
          );
          this.x += 8 * this.direction;
          this.y -= 8;
          break;
      }
    } else {
      this.setState(Consts.MoveStand, false);
    }
  }

  makeIce() {
    this.engine.sound.play("new-ice");
    this.engine.addIceBlock(this.xTile + this.direction, this.yTile + 1);
    this.engine.addSparks(this.xTile + this.direction, this.yTile + 1);
    this.engine.addSparks(
      this.xTile + this.direction,
      this.yTile + 1,
      "124, 214, 255",
      5
    );
  }

  removeIceBlock() {
    this.engine.sound.play("ice-remove");
    this.engine.removeIceBlock(this.xTile + this.direction, this.yTile + 1);
    this.engine.addSparks(this.xTile + this.direction, this.yTile + 1);
    this.engine.addSparks(
      this.xTile + this.direction,
      this.yTile + 1,
      "124, 214, 255",
      5
    );
  }

  push() {
    let ice = this.engine.iceAt(this.xTile + this.direction, this.yTile);
    if (ice && ice.canGlide(this.direction)) {
      this.engine.addSparks(
        this.xTile + this.direction,
        this.yTile,
        "255, 255, 255",
        3
      );
      this.engine.addSparks(
        this.xTile + this.direction,
        this.yTile,
        "124, 214, 255",
        3,
        1.5
      );
      this.setAnim(
        Consts.AnimPushStart,
        Consts.AnimPushEnd,
        false,
        this.direction === Consts.DirRight
          ? Consts.AnimRightRow
          : Consts.AnimLeftRow,
        3
      );
      this.setState(Consts.MovePush, true);
    }
  }

  doPush() {
    this.counter += 2;
    if (this.counter > Consts.AnimFrameCount) {
      const ice = this.engine.iceAt(this.xTile + this.direction, this.yTile);
      if (ice) {
        this.engine.sound.play("ice-push");
        ice.push(this.direction);
      }
      this.setState(Consts.MoveStand, false);
    }
  }

  doIce() {
    if (this.counter === 8) {
      if (this.state === Consts.MoveIceMake) {
        this.makeIce();
      } else {
        this.removeIceBlock();
      }
    }
    this.counter += 1;
    if (this.counter >= Consts.AnimFrameCount) {
      this.setState(Consts.MoveStand, false);
    }
  }

  doFailIce() {
    if (this.counter === 8) {
      this.engine.sound.play("ice-disabled");
      this.engine.addSparks(
        this.xTile + this.direction,
        this.yTile + 1,
        "88,66,66"
      );
    }
    this.counter += 1;
    if (this.counter >= Consts.AnimFrameCount) {
      this.setState(Consts.MoveStand, false);
    }
  }

  collisions() {
    if (
      this.engine.spriteTypeAt(this.xTile, this.yTile, Consts.ObjectPlayer) ===
      Consts.ObjectFire
    ) {
      this.burn();
    }
  }

  move() {
    this.gravity();
    this.collisions();
    if (this.state !== Consts.MoveStand) {
      this.standCounter = 0;
    }
    if (this.state !== Consts.MoveDown) {
      this.fallCounter = 0;
    }
    switch (this.state) {
      case Consts.MoveRight:
        this.doRun();
        break;
      case Consts.MoveLeft:
        this.doRun();
        break;
      case Consts.MoveDown:
        this.doGravity();
        break;
      case Consts.MoveUp:
        this.doUp();
        break;
      case Consts.MoveTurn:
        this.doTurn();
        break;
      case Consts.MoveIceMake:
      case Consts.MoveIceRemove:
        this.doIce();
        break;
      case Consts.MoveIceFail:
        this.doFailIce();
        break;
      case Consts.MoveStand:
        this.doStand();
        break;
      case Consts.MovePush:
        this.doPush();
        break;
      case Consts.MoveRip:
        this.doRip();
        break;
      case Consts.MoveLevelExit:
        this.doOutro();
        break;
      case Consts.MoveLevelEnter:
        this.doIntro();
        break;
    }
  }
}
