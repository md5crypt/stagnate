export type CollectableArray<T> = (CollectableArray<T> | T | undefined | null | false)[]
export type CollectableValue<T> = CollectableArray<T> | T | undefined | null | false

export type RefererPolicy = "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url"

export interface EvenHandlers {
	onAnimationCancel: (ev: AnimationEvent) => void
	onAnimationEnd: (ev: AnimationEvent) => void
	onAnimationIteration: (ev: AnimationEvent) => void
	onAnimationStart: (ev: AnimationEvent) => void
	onBlur: (ev: FocusEvent) => void
	onChange: (ev: Event) => void
	onClick: (ev: MouseEvent) => void
	onClose: (ev: Event) => void
	onDrag: (ev: DragEvent) => void
	onDragEnd: (ev: DragEvent) => void
	onDragEnter: (ev: DragEvent) => void
	onDragLeave: (ev: DragEvent) => void
	onDragOver: (ev: DragEvent) => void
	onDragStart: (ev: DragEvent) => void
	onDrop: (ev: DragEvent) => void
	onContextMenu: (ev: MouseEvent) => void
	onDblClick: (ev: MouseEvent) => void
	onFocus: (ev: FocusEvent) => void
	onInput: (ev: Event) => void
	onKeyDown: (ev: KeyboardEvent) => void
	onKeyPress: (ev: KeyboardEvent) => void
	onKeyUp: (ev: KeyboardEvent) => void
	onLoad: (ev: Event) => void
	onMouseDown: (ev: MouseEvent) => void
	onMouseEnter: (ev: MouseEvent) => void
	onMouseLeave: (ev: MouseEvent) => void
	onMouseMove: (ev: MouseEvent) => void
	onMouseOut: (ev: MouseEvent) => void
	onMouseOver: (ev: MouseEvent) => void
	onMouseUp: (ev: MouseEvent) => void
	onPointerCancel: (ev: PointerEvent) => void
	onPointerDown: (ev: PointerEvent) => void
	onPointerEnter: (ev: PointerEvent) => void
	onPointerLeave: (ev: PointerEvent) => void
	onPointerMove: (ev: PointerEvent) => void
	onPointerOut: (ev: PointerEvent) => void
	onPointerOver: (ev: PointerEvent) => void
	onPointerUp: (ev: PointerEvent) => void
	onScroll: (ev: Event) => void
	onTouchCancel: (ev: TouchEvent) => void
	onTouchEnd: (ev: TouchEvent) => void
	onTouchMove: (ev: TouchEvent) => void
	onTouchStart: (ev: TouchEvent) => void
	onTransitionCancel: (ev: TransitionEvent) => void
	onTransitionEnd: (ev: TransitionEvent) => void
	onTransitionRun: (ev: TransitionEvent) => void
	onTransitionStart: (ev: TransitionEvent) => void
}

export interface GlobalAttributes<T> extends Partial<EvenHandlers> {
	ref?: (value: T) => void
	id?: string
	class?: CollectableValue<string>
	style?: Partial<CSSStyleDeclaration>
	title?: string
	tabIndex?: number
	innerHTML?: string
	accessKey?: "string"
	autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters"
	autoFocus?: boolean
	contentEditable?: boolean
	dir?: "ltr" | "rtl" | "auto"
	draggable?: boolean
	enterKeyHint?: boolean
	hidden?: boolean
	inert?: boolean
	inputMode?: "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url"
	lang?: string
	role?: string
	spellcheck?: boolean | string
	translate?: "" | "yes" | "no"
	virtualKeyboardPolicy?: "auto" | "manual"
}

export interface HTMLElementAttributes<T> extends GlobalAttributes<T> {
	children?: CollectableValue<JSX.Element | string>
}

export interface TextElementAttributes {
	value?: string
	ref?: (value: Text) => void
	children?: CollectableValue<string>
}

export interface ImageElementAttributes extends GlobalAttributes<HTMLImageElement> {
	alt?: string
	src?: string
	crossOrigin?: "anonymous" | "use-credentials"
}

export interface AnchorElementAttributes extends GlobalAttributes<HTMLAnchorElement> {
	href?: string
	target?: "_self" | "_blank" | "_parent" | "_top"
	rel?: string
	download?: string
	referrerPolicy?: RefererPolicy
	children?: CollectableValue<JSX.Element | string>
}

export interface InputElementAttributes extends GlobalAttributes<HTMLInputElement> {
	type?: "button" | "checkbox" | "checkbox" | "hidden" | "password" | "radio" | "text" | "file"
	alt?: string
	checked?: boolean
	disabled?: boolean
	maxLength?: number
	minLength?: number
	name?: string
	placeholder?: string
	readonly?: boolean
	value?: string
	accept?: string
	multiple?: boolean
}

export interface TextAreaElementAttributes extends GlobalAttributes<HTMLTextAreaElement> {
	cols?: number
	rows?: number
	disabled?: boolean
	maxLength?: number
	minLength?: number
	name?: string
	placeholder?: string
	readonly?: boolean
	value?: string
	spellcheck?: boolean | "default"
	wrap?: "hard" | "soft" | "off"
	children?: CollectableValue<string>
}

export interface SelectElementAttributes extends GlobalAttributes<HTMLSelectElement> {
	disabled?: boolean
	name?: string
	children?: CollectableValue<JSX.Element | string>
	value?: string
}

export interface OptionElementAttributes extends GlobalAttributes<HTMLOptionElement> {
	disabled?: boolean
	label?: string
	selected?: string
	value?: string
	children?: CollectableValue<string>
}

export interface IframeElementAttributes extends GlobalAttributes<HTMLIFrameElement> {
	allow?: string
	allowFullScreen?: boolean
	referrerPolicy?: RefererPolicy
	sandbox?: string
	src?: string
}

export interface IframeElementAttributes extends GlobalAttributes<HTMLIFrameElement> {
	allow?: string
	allowFullScreen?: boolean
	referrerPolicy?: RefererPolicy
	sandbox?: string
	src?: string
}

export interface SvgElementAttributes extends GlobalAttributes<SVGElement> {
	viewBox?: string
	fill?: string
	children?: CollectableValue<JSX.Element | string>
}

export namespace JSX {
	export interface IntrinsicElements {
		text: TextElementAttributes
		div: HTMLElementAttributes<HTMLDivElement>
		span: HTMLElementAttributes<HTMLSpanElement>
		img: ImageElementAttributes
		a: AnchorElementAttributes
		input: InputElementAttributes
		textarea: TextAreaElementAttributes
		select: SelectElementAttributes
		option: OptionElementAttributes
		iframe: IframeElementAttributes
		svg: SvgElementAttributes
		[key: `svg:${string}`]: GlobalAttributes<SVGElement> & Record<string, any>
	}
	export interface ElementChildrenAttribute {
		children: {}
	}
	export interface Element extends globalThis.Element {}
	export interface ElementClass {
		htmlRoot: JSX.Element | null
	}
	export interface IntrinsicClassAttributes<T> {
		ref?: (value: T) => void
	}
	export interface ElementAttributesProperty {
		props: {}
	}
}

/** get props of an JSX element or component function / class */
export type ComponentProps<T extends keyof JSX.IntrinsicElements | {props: any} | ((props: any) => any)> =
	T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] :
		(T extends {props: any} ? T["props"] :
			(T extends (props: any) => any ? Parameters<T>[0] : never))

/** any value that can be used in JSX */
export type StagnateNode = CollectableValue<JSX.Element | string>

/** the JSX element css class attribute */
export type ClassAttribute = CollectableValue<string>
