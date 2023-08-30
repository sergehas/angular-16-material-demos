import { TestBed, fakeAsync, tick } from "@angular/core/testing";

import { NotificationService, Notification } from "./notification.service";

describe("NotificationService", () => {
	let service: NotificationService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NotificationService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
	it("should send a notif", () => {
		let count = 0;
		service.notify({ severity: "info", message: "msg" });
		service.notify({ severity: "info", message: "msg2" });
		service.notifications$.subscribe((n) => {
			count = n.size;
			expect(count).toEqual(2);
		});
	});
	it("should remove a notif", () => {
		let count = 0;
		const n1 = service.notify({ severity: "info", message: "msg" });
		const n2 = service.notify({ severity: "info", message: "msg2" });
		const n3 = service.notify({ severity: "info", message: "msg3" });
		service.dismiss(n2);
		service.notifications$.subscribe((n) => {
			count = n.size;
			expect(count).toEqual(2);
			expect(n.has(n1)).toBeTrue();
			expect(n.has(n3)).toBeTrue();
		});
	});
	it("should clear all notifs", () => {
		let count = 0;
		const n1 = service.notify({ severity: "info", message: "msg" });
		const n2 = service.notify({ severity: "info", message: "msg2" });
		const n3 = service.notify({ severity: "info", message: "msg3" });
		service.clear();
		service.notifications$.subscribe((n) => {
			expect(n.size).toEqual(0);
		});
	});
	it("should publish all event", fakeAsync(() => {
		const n1 = { severity: "info", message: "msg" } as Notification;
		const n2 = { severity: "info", message: "msg2" } as Notification;
		let x = new Set<Notification>();
		service.notifications$.subscribe((s) => (x = s));
		expect(x.size).toEqual(0);
		service.notify(n1);
		tick();
		expect(x.size).toEqual(1);
		service.notify(n2);
		tick();
		expect(x.size).toEqual(2);
		service.dismiss(n2);
		tick();
		expect(x.size).toEqual(1);
		service.clear();
		tick();
		expect(x.size).toEqual(0);
	}));
});
