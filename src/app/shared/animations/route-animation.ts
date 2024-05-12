import {
  animate,
  animation,
  group,
  query,
  style,
  transition,
  trigger,
  useAnimation,
} from "@angular/animations";

const animationTime = ".2s";

const translateX = animation([
  style({ transform: "translateX({{from}})" }),
  animate("{{ time }} ease-in-out", style({ transform: "translateX({{to}})" })),
]);

const left = [
  query(":enter, :leave", style({ position: "absolute", width: "100%" }), {
    optional: true,
  }),
  group([
    query(
      ":enter",
      useAnimation(translateX, {
        params: { time: animationTime, from: "-100%", to: "0%" },
      }),
      { optional: true }
    ),
    query(
      ":leave",
      useAnimation(translateX, {
        params: { time: animationTime, from: "0%", to: "100%" },
      }),
      { optional: true }
    ),
  ]),
];
const right = [
  query(":enter, :leave", style({ position: "absolute", width: "100%" }), {
    optional: true,
  }),
  group([
    query(
      ":enter",
      useAnimation(translateX, {
        params: { time: animationTime, from: "100%", to: "0%" },
      }),
      { optional: true }
    ),
    query(
      ":leave",
      useAnimation(translateX, {
        params: { time: animationTime, from: "0%", to: "-100%" },
      }),
      { optional: true }
    ),
  ]),
];

const translateY = animation([
  style({ transform: "translateY({{from}})" }),
  animate("{{ time }} ease-in-out", style({ transform: "translateY({{to}})" })),
]);

const top = [
  query(
    ":enter, :leave",
    style({ position: "absolute", width: "100%", height: "100%" }),
    { optional: true }
  ),
  group([
    query(
      ":enter",
      useAnimation(translateY, {
        params: { time: animationTime, from: "-100%", to: "0%" },
      }),
      { optional: true }
    ),
    query(
      ":leave",
      useAnimation(translateY, {
        params: { time: animationTime, from: "0%", to: "100%" },
      }),
      { optional: true }
    ),
  ]),
];
const bottom = [
  query(
    ":enter, :leave",
    style({ position: "absolute", width: "100%", height: "100%" }),
    { optional: true }
  ),
  group([
    query(
      ":enter",
      useAnimation(translateY, {
        params: { time: animationTime, from: "100%", to: "0%" },
      }),
      { optional: true }
    ),
    query(
      ":leave",
      useAnimation(translateY, {
        params: { time: animationTime, from: "0%", to: "-100%" },
      }),
      { optional: true }
    ),
  ]),
];

export const slideAnimations = trigger("routeAnimations", [
  transition("slideRight <=> *", right),
  transition("slideLeft <=> *", left),

  transition("slideTop <=> *", top),
  transition("* <=> slideBottom", bottom),

  transition(":increment", right),
  transition(":decrement", left),
]);
