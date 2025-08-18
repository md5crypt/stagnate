import { Component } from "./Component"
import type { JSX, CollectableArray, StagnateNode } from "./types"

function _collect<T>(data: CollectableArray<T>, accumulator: T[]) {
	for (let i = 0; i < data.length; i += 1) {
		const value = data[i]
		if (Array.isArray(value)) {
			_collect(value, accumulator)
		} else if (value) {
			accumulator.push(value)
		}
	}
}

function collect<T>(data: CollectableArray<T> | T) {
	if (Array.isArray(data)) {
		const accumulator = [] as T[]
		 _collect(data, accumulator)
		return accumulator
	}
	return data ? [data] : []
}

export function jsx(type: any, props: any) {
	if (type == "text") {
		const children = collect<string>(props.children)
		const element = document.createTextNode(children.length ? children.join("") : (props.value || ""))
		if (props.ref) {
			props.ref(element)
		}
		return element
	} else if (typeof type == "string") {
		const children = collect<Element | string>(props.children)
		let element: Element
		let isSvg = false
		if (type.startsWith("svg")) {
			element = document.createElementNS("http://www.w3.org/2000/svg", type.length == 3 ? "svg" : type.slice(4))
			isSvg = true
		} else {
			element = document.createElement(type)
		}
		for (const key in props) {
			let value = props[key]
			if (key == "children" || value === undefined) {
				continue
			} else if (key.startsWith("on")) {
				element.addEventListener(key.slice(2).toLowerCase(), value)
			} else if (key == "innerHTML") {
				element.innerHTML = value
			} else if (key == "ref") {
				value(element)
			} else if (key == "class") {
				if (Array.isArray(value)) {
					value = collect(value).join(" ")
				}
				if (value) {
					element.setAttribute("class", value)
				}
			} else if (key == "style") {
				Object.assign((element as HTMLElement).style, value)
			} else {
				const attribute = isSvg ? key : key.toLowerCase()
				if (value === true) {
					element.setAttribute(attribute, "")
				} else if (value === false || value === null) {
					element.removeAttribute(attribute)
				} else if (typeof value == "string") {
					element.setAttribute(attribute, value)
				} else {
					element.setAttribute(attribute, value.toString())
				}
			}
		}
		children.forEach(x => element.appendChild(x instanceof Node ? x : document.createTextNode(x.toString())))
		return element
	} else if (type.prototype instanceof Component) {
		const component = new type(props) as Component
		const element = component.build()
		if (props.ref) {
			props.ref(component)
		}
		return element
	} else {
		const element = type(props)
		if (props.ref) {
			props.ref(element)
		}
		return element
	}
}

export function createElement(type: any, props: any, ...children: any[]) {
	props.children = children
	return jsx(type, props)
}

/** JSX fragment component, <> can be used as an alias */
export function Fragment(props: {children: StagnateNode}) {
	return props.children as JSX.Element
}

export { jsx as jsxs }
export type { JSX }
