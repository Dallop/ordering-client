/**
 * order
 * @prop location {Id}
 * @prop consumer {Id}
 * @prop createdAt {Timestamp} - when the consumer clicked the button place
 * the order
 * @prop createdAtUnix {Number} - unix representation of createdAt property to
 * make time based firestore queries possible
 * @prop fulfillBy {Timestamp} - createdAt + time told to consumer for fulfillment
 * @prop items {Array} - the items that make up the order
 *   @prop id {Id}
 *   @prop selections {Array} - option ids selected by consumer
 *   @prop priceVariationIndex {Number} - index of selected serving portion
 * @prop status {String} - status of order. should equal 'awaitingValidation'
 * @prop method {Object} - {type, label}
 */
export const placeOrder = orderItems => console.log(orderItems)
