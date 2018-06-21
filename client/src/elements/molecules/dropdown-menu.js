export class DropdownMenu {
  attached() {
    document.addEventListener("click", this.handleBodyClick, { capture: true });
  }

  detached() {
    document.removeEventListener("click", this.handleBodyClick, {
      capture: true
    });
  }

  handleBodyClick(event) {
    if (!event.target.matches("dropdown-menu__button")) {
      const dropdownMenus = Array.prototype.slice.call(
        document.querySelectorAll(".dropdown-menu__content")
      );
      dropdownMenus.map(dropdownMenu => {
        if (dropdownMenu.classList.contains("dropdown-menu--show")) {
          dropdownMenu.classList.remove("dropdown-menu--show");
        }
      });
    }
  }

  toggleDropdownMenu() {
    this.dropdownMenu.classList.toggle("dropdown-menu--show");
  }
}
