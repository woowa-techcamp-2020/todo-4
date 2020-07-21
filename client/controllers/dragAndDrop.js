import Data from "./data.js";

export default class DragAndDrop {
  static draggedCard = null;
  static enteredCard = null;
  static enteredColumn = null;
  static relativeTopInCard = 0;
  static relativeLeftInCard = 0;
  static dummyCardDirection = true;

  static updateDummyCardDirection(e, element) {
    if (this.isLocatedUp(e, element) !== this.dummyCardDirection) {
      this.popCardInfo();
      this.setDummyCardDirection(e);
      //      this.pushCardInfo();
      this.enteredColumn.update();
    }
  }
  static onEnterColumn(e, column) {
    this.enteredColumn = column;
  }

  static isDragging() {
    return this.draggedCard !== null;
  }

  static isEntered() {
    return this.enteredCard !== null;
  }

  static onMouseLeave(e) {
    this.clearEnteredCard();
  }
  static clearEnteredCard() {
    this.popCardInfo();
    this.enteredCard = null;
    this.enteredColumn.update();
  }

  static popCardInfo() {
    Data.popCardByColIdAndCardOrder(
      this.enteredCard.colId,
      this.dummyCardDirection
        ? this.enteredCard.orderInColumn
        : this.enteredCard.orderInColumn + 1
    );
  }

  static pushCardInfo() {
    Data.pushCardByColIdAndCardOrder(
      this.enteredCard.colId,
      this.dummyCardDirection
        ? this.enteredCard.orderInColumn
        : this.enteredCard.orderInColumn + 1,
      this.draggedCard.getCardInfo()
    );
  }

  static onEnterOtherCard(e, card) {
    this.setEnteredCard(card);
    this.setDummyCardDirection(e);
    this.pushCardInfo();
    this.enteredColumn.update();
  }
  static setEnteredCard(card) {
    this.enteredCard = card;
  }
  static setDummyCardDirection(e) {
    this.dummyCardDirection = this.isLocatedUp(e, this.enteredCard.element);
  }
  static isLocatedUp(e, element) {
    const bounds = element.getBoundingClientRect();
    const midOfYInEnteredCard = bounds.top + bounds.height / 2;
    const mouseY = e.clientY;
    return midOfYInEnteredCard > mouseY;
  }

  static setDraggedCard(e, card) {
    this.draggedCard = card;
    this.setCaptureImage(e);
    this.setEventListener();
  }

  static onMouseMove = (e) => {
    e.preventDefault();
    document.querySelector(".ondrag").style.left =
      e.clientX - 17 - this.relativeLeftInCard + "px";
    document.querySelector(".ondrag").style.top =
      e.clientY - 17 - this.relativeTopInCard + "px";
  };

  static setEventListener() {
    this.setMouseMoveEvent();
    this.setMouseUpEvent();
  }

  static setMouseMoveEvent() {
    window.addEventListener("mousemove", this.onMouseMove);
  }
  static onMouseUp = (e) => {
    e.preventDefault();
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
    this.draggedCard = null;
    this.enteredCard = null;
    this.enteredColumn = null;
  };
  static setMouseUpEvent() {
    window.addEventListener("mouseup", this.onMouseUp);
  }

  static setCaptureImage(e) {
    const cardElement = document.querySelector(".ondrag");
    cardElement.innerHTML = this.draggedCard.getInnerHtml();
    const bounds = this.draggedCard.element.getBoundingClientRect();
    this.relativeLeftInCard = e.clientX - bounds.left;
    this.relativeTopInCard = e.clientY - bounds.top;
    document.querySelector(".ondrag").style.left = bounds.left - 17 + "px";
    document.querySelector(".ondrag").style.top = bounds.top - 17 + "px";
  }
}
