import {clamp} from './catalog.mjs';

export const ZOOM_LEVELS = [1, 1.7, 2.6, 3.4];
export const DEFAULT_ZOOM = 2;

// Orthographic camera in the same projected coordinates as the paper diorama.
// The HUD and portrait touch controls reserve space without changing the optics.
export class RaceCamera {
  reset() {
    this.center = null;
    this.zoom = null;
    this.previousFocus = null;
  }

  update(bounds, viewport, focus, zoomIndex, dt) {
    const {width, height, top = 0, bottom = 0} = viewport;
    const safeHeight = Math.max(1, height - top - bottom);
    const fit = Math.min(width / bounds.w, safeHeight / bounds.h);
    const targetZoom = ZOOM_LEVELS[zoomIndex];
    const overview = zoomIndex === 0;
    const targetScale = fit * targetZoom;
    const target = overview
      ? {x: bounds.x + bounds.w / 2, y: bounds.y + bounds.h / 2}
      : {
          x: focus.x + clamp(focus.vx * .28, -.22 * width / targetScale, .22 * width / targetScale),
          y: focus.y + clamp(focus.vy * .28, -.22 * safeHeight / targetScale, .22 * safeHeight / targetScale),
        };

    const jump = this.previousFocus && !overview &&
      Math.hypot(this.previousFocus.x - focus.x, this.previousFocus.y - focus.y) > 120;
    this.previousFocus = focus;
    if (!this.center || jump) {
      this.center = {...target};
      this.zoom = targetZoom;
    } else {
      const follow = 1 - Math.exp(-13 * dt);
      const lens = 1 - Math.exp(-9 * dt);
      this.center.x += (target.x - this.center.x) * follow;
      this.center.y += (target.y - this.center.y) * follow;
      this.zoom += (targetZoom - this.zoom) * lens;
      if (Math.abs(targetZoom - this.zoom) < .001) this.zoom = targetZoom;
    }

    const scale = fit * this.zoom;
    if (!overview || this.zoom !== 1) {
      // Tight turns, a resize, or a respawn must never pull the car off screen.
      const limitX = width * .32 / scale;
      const limitY = safeHeight * .32 / scale;
      this.center.x = clamp(this.center.x, focus.x - limitX, focus.x + limitX);
      this.center.y = clamp(this.center.y, focus.y - limitY, focus.y + limitY);
    }

    const screenX = width / 2;
    const screenY = top + safeHeight / 2;
    const x = this.center.x - screenX / scale;
    const y = this.center.y - screenY / scale;
    return {x, y, w: width / scale, h: height / scale, scale};
  }
}
