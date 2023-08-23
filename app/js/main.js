/*  */
/* var swiper = new Swiper(".slider__img", {
	navigation: {
		nextEl: ".swiper-next-button",
		prevEl: ".swiper-prev-button"
	},
	effect: "fade",
	loop: "infinite",
	pagination: {
          el: ".pagination",
          type: "fraction",
        }
});

swiper.on('slideChange', function(sld) {
	document.body.setAttribute('data-sld', sld.realIndex);
}) */


class Slide {
	constructor(el, settings) {
		this.DOM = { el: el };

		this.settings = {
			detailsEl: null,
			onHideDetails: () => {
				return false;
			}
		};
		Object.assign(this.settings, settings);

		/* this.DOM.wrap = this.DOM.el.querySelector(".slide__wrap"); */

		this.DOM.img = this.DOM.wrap.querySelector(".slider__img");

		this.DOM.titleWrap = this.DOM.wrap.querySelector(".more-menu-text");

		this.DOM.detailsItems = Array.from(
			this.settings.detailsEl.querySelectorAll(".details__item")
		);
		this.totalDetailItems = this.DOM.detailsItems.length;

		this.DOM.hideDetailsCtrl = this.DOM.detailsItems.filter((item) =>
			item.classList.contains("details__item--close")
		)[0];
		this.DOM.hideDetailsCtrl.addEventListener("click", () =>
			this.settings.onHideDetails()
		);

		this.config = {
			animation: {
				duration: 1.2,
				ease: Expo.easeInOut
			}
		};
	}

	setCurrent(isCurrent = true) {
		this.DOM.el.classList[isCurrent ? "add" : "remove"]("slide--current");
	}

	hide(direction) {
		return this.toggle("hide", direction);
	}

	show(direction) {
		this.DOM.el.style.zIndex = 1000;
		return this.toggle("show", direction);
	}

	toggle(action, direction) {
		return new Promise((resolve, reject) => {
			if (action === "show") {
				TweenMax.to(this.DOM.wrap, this.config.animation.duration, {
					ease: this.config.animation.ease,
					startAt: { x: direction === "right" ? "100%" : "-100%" },
					x: "0%"
				});
				TweenMax.to(this.DOM.titleWrap, this.config.animation.duration, {
					ease: this.config.animation.ease,
					startAt: { x: direction === "right" ? "-100%" : "100%" },
					x: "0%"
				});
			}

			TweenMax.to(this.DOM.img, this.config.animation.duration, {
				ease: this.config.animation.ease,
				startAt:
					action === "hide"
						? {}
						: { x: direction === "right" ? "-100%" : "100%", scale: 1.1 },
				x: "0%",
				scale: action === "hide" ? 1.1 : 1,
				onStart: () => {
					this.DOM.img.style.transformOrigin =
						action === "hide"
							? direction === "right"
								? "100% 50%"
								: "0% 50%"
							: direction === "right"
							? "0% 50%"
							: "100% 50%";
					this.DOM.el.style.opacity = 1;
				},
				onComplete: () => {
					this.DOM.el.style.zIndex = 999;
					this.DOM.el.style.opacity = action === "hide" ? 0 : 1;
					resolve();
				}
			});
		});
	}
}