import {
	animate,
	group,
	query,
	style,
	transition,
	trigger,
} from "@angular/animations";

export const left = [
	query(":enter, :leave", style({ position: "absolute", width: "100%" }), { optional: true, }),
	group([
		query(":enter", [style({ transform: "translateX(-100%)" }), animate("0.5s ease-in-out", style({ transform: "translateX(0%)" })),],
			{ optional: true }
		),
		query(":leave", [style({ transform: "translateX(0%)" }), animate("0.5s ease-in-out", style({ transform: "translateX(100%)" })),],
			{ optional: true }
		),
	]),
];

export const right = [
	query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
	group([
		query(':enter', [style({ transform: 'translateX(100%)' }), animate('.5s ease-in-out', style({ transform: 'translateX(0%)' }))], {
			optional: true,
		}),
		query(':leave', [style({ transform: 'translateX(0%)' }), animate('.5s ease-in-out', style({ transform: 'translateX(-100%)' }))], {
			optional: true,
		}),
	]),
];

export const slideInAnimation = trigger("routeAnimations", [
	transition("slideRight => *", right),
	transition("* => slideRight", left),
	transition("slideLeft => *", left),
	transition("* => slideLeft", right),
	transition("slideLeft => void", right),
	transition("void => slideLeft", left),
]);
