/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string=} email
 * @property {string=} profileImageUrl
 */

/**
 * @typedef {Object} Platform
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 */

/**
 * @typedef {Object} Game
 * @property {number} id
 * @property {string} slug
 * @property {string} displayName
 * @property {number} platformId
 */

/**
 * @typedef {Object} OverlayCanvas
 * @property {number} baseWidth
 * @property {number} baseHeight
 */

/**
 * @typedef {Object} OverlaySettings
 * @property {number} opacity
 */

/**
 * @typedef {Object} OverlayJsonMeta
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} BaseElement
 * @property {string} id
 * @property {"rect" | "circle" | "line"} type
 * @property {number} opacity
 * @property {number} zIndex
 * @property {boolean} visible
 * @property {boolean} locked
 */

/**
 * @typedef {BaseElement & {
 *  x: number,
 *  y: number,
 *  width: number,
 *  height: number,
 *  rotation: number,
 *  fillColor: string,
 *  strokeColor: string,
 *  strokeWidth: number,
 *  cornerRadius: number
 * }} RectElement
 */

/**
 * @typedef {BaseElement & {
 *  x: number,
 *  y: number,
 *  width: number,
 *  height: number,
 *  rotation: number,
 *  fillColor: string,
 *  strokeColor: string,
 *  strokeWidth: number
 * }} CircleElement
 */

/**
 * @typedef {BaseElement & {
 *  x1: number,
 *  y1: number,
 *  x2: number,
 *  y2: number,
 *  strokeColor: string,
 *  strokeWidth: number,
 *  dashStyle: "solid" | "dash" | "dot"
 * }} LineElement
 */

/**
 * @typedef {RectElement | CircleElement | LineElement} OverlayElement
 */
