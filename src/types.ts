export type CollectableArray<T> = (CollectableArray<T> | T | undefined | null | false)[]
export type CollectableValue<T> = CollectableArray<T> | T | undefined | null | false

export type RefererPolicy =
	| "no-referrer"
	| "no-referrer-when-downgrade"
	| "origin"
	| "origin-when-cross-origin"
	| "same-origin"
	| "strict-origin"
	| "strict-origin-when-cross-origin"
	| "unsafe-url"

export type LinkTarget =
	| "_self"
	| "_blank"
	| "_parent"
	| "_top"

export interface EventHandlers {
	// Animations & Transitions
	onAnimationCancel?: (ev: AnimationEvent) => void
	onAnimationEnd?: (ev: AnimationEvent) => void
	onAnimationIteration?: (ev: AnimationEvent) => void
	onAnimationStart?: (ev: AnimationEvent) => void
	onTransitionCancel?: (ev: TransitionEvent) => void
	onTransitionEnd?: (ev: TransitionEvent) => void
	onTransitionRun?: (ev: TransitionEvent) => void
	onTransitionStart?: (ev: TransitionEvent) => void

	// Clipboard
	onCopy?: (ev: ClipboardEvent) => void
	onCut?: (ev: ClipboardEvent) => void
	onPaste?: (ev: ClipboardEvent) => void

	// Composition (IME)
	onCompositionStart?: (ev: CompositionEvent) => void
	onCompositionUpdate?: (ev: CompositionEvent) => void
	onCompositionEnd?: (ev: CompositionEvent) => void

	// Focus
	onFocus?: (ev: FocusEvent) => void
	onBlur?: (ev: FocusEvent) => void
	onFocusIn?: (ev: FocusEvent) => void
	onFocusOut?: (ev: FocusEvent) => void

	// Form & input
	onBeforeInput?: (ev: InputEvent) => void
	onChange?: (ev: InputEvent) => void
	onInput?: (ev: InputEvent) => void
	onInvalid?: (ev: Event) => void
	onReset?: (ev: Event) => void
	onSubmit?: (ev: SubmitEvent) => void

	// Keyboard
	onKeyDown?: (ev: KeyboardEvent) => void
	onKeyUp?: (ev: KeyboardEvent) => void

	// Mouse
	onAuxClick?: (ev: MouseEvent) => void
	onClick?: (ev: MouseEvent) => void
	onContextMenu?: (ev: MouseEvent) => void
	onDblClick?: (ev: MouseEvent) => void
	onMouseDown?: (ev: MouseEvent) => void
	onMouseEnter?: (ev: MouseEvent) => void
	onMouseLeave?: (ev: MouseEvent) => void
	onMouseMove?: (ev: MouseEvent) => void
	onMouseOut?: (ev: MouseEvent) => void
	onMouseOver?: (ev: MouseEvent) => void
	onMouseUp?: (ev: MouseEvent) => void
	onWheel?: (ev: WheelEvent) => void

	// Pointer
	onPointerCancel?: (ev: PointerEvent) => void
	onPointerDown?: (ev: PointerEvent) => void
	onPointerEnter?: (ev: PointerEvent) => void
	onPointerLeave?: (ev: PointerEvent) => void
	onPointerMove?: (ev: PointerEvent) => void
	onPointerOut?: (ev: PointerEvent) => void
	onPointerOver?: (ev: PointerEvent) => void
	onPointerUp?: (ev: PointerEvent) => void
	onGotPointerCapture?: (ev: PointerEvent) => void
	onLostPointerCapture?: (ev: PointerEvent) => void

	// Drag & drop
	onDrag?: (ev: DragEvent) => void
	onDragEnd?: (ev: DragEvent) => void
	onDragEnter?: (ev: DragEvent) => void
	onDragLeave?: (ev: DragEvent) => void
	onDragOver?: (ev: DragEvent) => void
	onDragStart?: (ev: DragEvent) => void
	onDrop?: (ev: DragEvent) => void

	// Media
	onCanPlay?: (ev: Event) => void
	onCanPlayThrough?: (ev: Event) => void
	onDurationChange?: (ev: Event) => void
	onEmptied?: (ev: Event) => void
	onEnded?: (ev: Event) => void
	onLoadedData?: (ev: Event) => void
	onLoadedMetadata?: (ev: Event) => void
	onLoadStart?: (ev: Event) => void
	onPause?: (ev: Event) => void
	onPlay?: (ev: Event) => void
	onPlaying?: (ev: Event) => void
	onRateChange?: (ev: Event) => void
	onSeeked?: (ev: Event) => void
	onSeeking?: (ev: Event) => void
	onStalled?: (ev: Event) => void
	onSuspend?: (ev: Event) => void
	onTimeUpdate?: (ev: Event) => void
	onVolumeChange?: (ev: Event) => void
	onWaiting?: (ev: Event) => void

	// View & misc
	onClose?: (ev: Event) => void
	onError?: (ev: Event) => void
	onLoad?: (ev: Event) => void
	onResize?: (ev: UIEvent) => void
	onScroll?: (ev: Event) => void
	onToggle?: (ev: Event) => void
}

export interface GlobalAttributes<T> extends EventHandlers {
	ref?: (value: T) => void
	id?: string
	class?: CollectableValue<string>
	style?: Partial<CSSStyleDeclaration>
	title?: string
	tabIndex?: number
	innerHTML?: string

	// Global attributes
	accessKey?: string
	autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters"
	autoFocus?: boolean
	contentEditable?: "true" | "false" | "plaintext-only"
	dir?: "ltr" | "rtl" | "auto"
	draggable?: "true" | "false"
	enterKeyHint?: "enter" | "done" | "go" | "next" | "previous" | "search" | "send"
	hidden?: boolean
	inert?: boolean
	inputMode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url"
	lang?: string
	nonce?: string
	popover?: "auto" | "manual"
	spellcheck?: "true" | "false"
	translate?: "yes" | "no"
	is?: string
	virtualKeyboardPolicy?: "auto" | "manual"
	role?: string

	/** Web components / shadow DOM related */
	slot?: string
	part?: string
	exportParts?: string

	/** Micro data */
	itemId?: string
	itemProp?: string
	itemRef?: string
	itemScope?: boolean
	itemType?: string

	// ARIA & data-* passthrough
	[key: `aria-${string}`]: string | number | undefined
	[key: `data-${string}`]: string | number | undefined
}

export interface FormSubmitterAttributes {
	form?: string
	formAction?: string
	formEncType?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain"
	formMethod?: "get" | "post" | "dialog"
	formNoValidate?: boolean
	formTarget?: LinkTarget
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
	srcSet?: string
	sizes?: string
	width?: number | string
	height?: number | string
	crossOrigin?: "anonymous" | "use-credentials"
	decoding?: "sync" | "async" | "auto"
	fetchPriority?: "high" | "low" | "auto"
	isMap?: boolean
	useMap?: string
	loading?: "eager" | "lazy"
	referrerPolicy?: RefererPolicy
	elementTiming?: string
}

export interface AnchorElementAttributes extends GlobalAttributes<HTMLAnchorElement> {
	href?: string
	target?: LinkTarget
	rel?: string
	hreflang?: string
	referrerPolicy?: RefererPolicy
	download?: boolean | string
	ping?: string
	type?: string
	children?: CollectableValue<JSX.Element | string>
}

export interface InputElementAttributes extends GlobalAttributes<HTMLInputElement>, FormSubmitterAttributes {
	type?: (
		| "button"
		| "checkbox"
		| "color"
		| "date"
		| "datetime-local"
		| "email"
		| "file"
		| "hidden"
		| "image"
		| "month"
		| "number"
		| "password"
		| "radio"
		| "range"
		| "reset"
		| "search"
		| "submit"
		| "tel"
		| "text"
		| "time"
		| "url"
		| "week"
	)
	alt?: string // type=image
	checked?: boolean // checkbox/radio
	accept?: string // type=file
	capture?: boolean | "user" | "environment" // type=file
	autocomplete?: string
	autoFocus?: boolean
	dirName?: string
	disabled?: boolean
	list?: string
	max?: number | string
	maxLength?: number
	min?: number | string
	minLength?: number
	multiple?: boolean
	name?: string
	pattern?: string
	placeholder?: string
	readonly?: boolean
	required?: boolean
	size?: number
	src?: string // type=image
	step?: number | "any"
	width?: string | number // type=image
	height?: string | number // type=image
	value?: string | number
	inputMode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url"
	popoverTarget?: string
	popoverTargetAction?: "toggle" | "show" | "hide"
}

export interface TextAreaElementAttributes extends GlobalAttributes<HTMLTextAreaElement> {
	cols?: number
	rows?: number
	autoFocus?: boolean
	disabled?: boolean
	maxLength?: number
	minLength?: number
	name?: string
	placeholder?: string
	readonly?: boolean
	required?: boolean
	value?: string
	wrap?: "hard" | "soft" | "off"
	dirName?: string
	form?: string
}

export interface SelectElementAttributes extends GlobalAttributes<HTMLSelectElement> {
	autoFocus?: boolean
	disabled?: boolean
	form?: string
	multiple?: boolean
	name?: string
	required?: boolean
	size?: number
	autocomplete?: string
	value?: string | number | string[]
	children?: CollectableValue<JSX.Element | string>
}

export interface OptionElementAttributes extends GlobalAttributes<HTMLOptionElement> {
	disabled?: boolean
	label?: string
	selected?: boolean
	value?: string
	children?: CollectableValue<string>
}

export interface OptGroupElementAttributes extends GlobalAttributes<HTMLOptGroupElement> {
	disabled?: boolean
	label?: string
}

export interface LabelElementAttributes extends GlobalAttributes<HTMLLabelElement> {
	for?: string
	form?: string
}

export interface ButtonElementAttributes extends GlobalAttributes<HTMLButtonElement>, FormSubmitterAttributes {
	autoFocus?: boolean
	disabled?: boolean
	name?: string
	type?: "button" | "submit" | "reset"
	value?: string
	popoverTarget?: string
	popoverTargetAction?: "toggle" | "show" | "hide"
}

export interface FieldsetElementAttributes extends GlobalAttributes<HTMLFieldSetElement> {
	disabled?: boolean
	form?: string
	name?: string
}

export interface OutputElementAttributes extends GlobalAttributes<HTMLOutputElement> {
	for?: string
	form?: string
	name?: string
	value?: string
}

export interface ProgressElementAttributes extends GlobalAttributes<HTMLProgressElement> {
	max?: number
	value?: number
}

export interface MeterElementAttributes extends GlobalAttributes<HTMLMeterElement> {
	value?: number
	min?: number
	max?: number
	low?: number
	high?: number
	optimum?: number
	form?: string
}

export interface FormElementAttributes extends GlobalAttributes<HTMLFormElement> {
	acceptCharset?: string
	action?: string
	autocomplete?: "on" | "off" | string
	encType?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain"
	method?: "get" | "post" | "dialog"
	name?: string
	noValidate?: boolean
	rel?: string
	target?: LinkTarget
	children?: CollectableValue<JSX.Element | string>
}

export interface IframeElementAttributes extends GlobalAttributes<HTMLIFrameElement> {
	src?: string
	srcDoc?: string
	name?: string
	allow?: string
	allowFullScreen?: boolean
	referrerPolicy?: RefererPolicy
	sandbox?: string
	loading?: "eager" | "lazy"
	width?: number | string
	height?: number | string
}

export interface SvgElementAttributes extends GlobalAttributes<SVGElement> {
	viewBox?: string
	fill?: string
	width?: number | string
	height?: number | string
	children?: CollectableValue<JSX.Element | string>
}

export interface AudioElementAttributes extends GlobalAttributes<HTMLAudioElement> {
	src?: string
	autoPlay?: boolean
	controls?: boolean
	loop?: boolean
	muted?: boolean
	preload?: "none" | "metadata" | "auto" | true
	crossOrigin?: "anonymous" | "use-credentials"
	controlsList?: string
}

export interface VideoElementAttributes extends GlobalAttributes<HTMLVideoElement> {
	src?: string
	autoPlay?: boolean
	controls?: boolean
	loop?: boolean
	muted?: boolean
	preload?: "none" | "metadata" | "auto" | true
	crossOrigin?: "anonymous" | "use-credentials"
	controlsList?: string
	playsInline?: boolean
	width?: string | number
	height?: string | number
	poster?: string
}

export interface SourceElementAttributes extends GlobalAttributes<HTMLSourceElement> {
	src?: string
	type?: string
	media?: string
	srcSet?: string
	sizes?: string
}

export interface TrackElementAttributes extends GlobalAttributes<HTMLTrackElement> {
	default?: boolean
	kind?: "subtitles" | "captions" | "descriptions" | "chapters" | "metadata"
	label?: string
	src?: string
	srcLang?: string
}

export interface CanvasElementAttributes extends GlobalAttributes<HTMLCanvasElement> {
	width?: string | number
	height?: string | number
}

export interface MapElementAttributes extends GlobalAttributes<HTMLMapElement> {
	name?: string
}

export interface AreaElementAttributes extends GlobalAttributes<HTMLAreaElement> {
	alt?: string
	coords?: string
	download?: boolean | string
	href?: string
	ping?: string
	referrerPolicy?: RefererPolicy
	rel?: string
	shape?: "rect" | "circle" | "poly" | "default"
	target?: LinkTarget
}

export interface ColGroupElementAttributes extends GlobalAttributes<HTMLTableColElement> {
	span?: number
}

export interface ColElementAttributes extends GlobalAttributes<HTMLTableColElement> {
	span?: number
}

export interface ThElementAttributes extends GlobalAttributes<HTMLTableCellElement> {
	abbr?: string
	colSpan?: number
	rowSpan?: number
	headers?: string
	scope?: "row" | "col" | "rowgroup" | "colgroup" | "auto"
}

export interface TdElementAttributes extends GlobalAttributes<HTMLTableCellElement> {
	colSpan?: number
	rowSpan?: number
	headers?: string
}

export interface OlElementAttributes extends GlobalAttributes<HTMLOListElement> {
	reversed?: boolean
	start?: number
	type?: "1" | "a" | "A" | "i" | "I"
}

export interface LiElementAttributes extends GlobalAttributes<HTMLLIElement> {
	value?: number
}

export interface BlockquoteElementAttributes extends GlobalAttributes<HTMLQuoteElement> {
	cite?: string
}

export interface QElementAttributes extends GlobalAttributes<HTMLQuoteElement> {
	cite?: string
}

export interface DataElementAttributes extends GlobalAttributes<HTMLDataElement> {
	value?: string | number
}

export interface TimeElementAttributes extends GlobalAttributes<HTMLTimeElement> {
	dateTime?: string
}

export interface DetailsElementAttributes extends GlobalAttributes<HTMLDetailsElement> {
	open?: boolean
}

export interface DialogElementAttributes extends GlobalAttributes<HTMLDialogElement> {
	open?: boolean
}

export interface LinkElementAttributes extends GlobalAttributes<HTMLLinkElement> {
	as?: string
	crossOrigin?: "anonymous" | "use-credentials"
	disabled?: boolean
	fetchPriority?: "high" | "low" | "auto"
	href?: string
	imageSizes?: string
	imageSrcSet?: string
	integrity?: string
	media?: string
	referrerPolicy?: RefererPolicy
	rel?: string
	sizes?: string
	type?: string
	blocking?: "render"
}

export interface MetaElementAttributes extends GlobalAttributes<HTMLMetaElement> {
	charset?: string
	content?: string
	httpEquiv?: string
	name?: string
	media?: string
}

export interface BaseElementAttributes extends GlobalAttributes<HTMLBaseElement> {
	href?: string
	target?: LinkTarget
}

export interface ScriptElementAttributes extends GlobalAttributes<HTMLScriptElement> {
	async?: boolean
	defer?: boolean
	crossOrigin?: "anonymous" | "use-credentials"
	integrity?: string
	nonce?: string
	referrerPolicy?: RefererPolicy
	src?: string
	type?: string
	noModule?: boolean
	blocking?: "render"
}

export interface StyleElementAttributes extends GlobalAttributes<HTMLStyleElement> {
	media?: string
	nonce?: string
	blocking?: "render"
}

export interface ObjectElementAttributes extends GlobalAttributes<HTMLObjectElement> {
	data?: string
	type?: string
	name?: string
	width?: number | string
	height?: number | string
	useMap?: string
	form?: string
	typemustmatch?: boolean
}

export interface EmbedElementAttributes extends GlobalAttributes<HTMLEmbedElement> {
	src?: string
	type?: string
	width?: number | string
	height?: number | string
}

export interface SlotElementAttributes extends GlobalAttributes<HTMLSlotElement> {
	name?: string
}

export interface TableElementAttributes extends GlobalAttributes<HTMLTableElement> {
	sortable?: boolean
}

export interface InsDelElementAttributes extends GlobalAttributes<HTMLModElement> {
	cite?: string
	dateTime?: string
}

export namespace JSX {
	export interface IntrinsicElements {
		// Text node proxy
		text: TextElementAttributes

		// Document & metadata
		html: HTMLElementAttributes<HTMLHtmlElement>
		head: HTMLElementAttributes<HTMLHeadElement>
		base: BaseElementAttributes
		link: LinkElementAttributes
		meta: MetaElementAttributes
		style: StyleElementAttributes
		title: HTMLElementAttributes<HTMLTitleElement>
		body: HTMLElementAttributes<HTMLBodyElement>

		// Sections
		address: HTMLElementAttributes<HTMLElement>
		article: HTMLElementAttributes<HTMLElement>
		aside: HTMLElementAttributes<HTMLElement>
		footer: HTMLElementAttributes<HTMLElement>
		header: HTMLElementAttributes<HTMLElement>
		h1: HTMLElementAttributes<HTMLHeadingElement>
		h2: HTMLElementAttributes<HTMLHeadingElement>
		h3: HTMLElementAttributes<HTMLHeadingElement>
		h4: HTMLElementAttributes<HTMLHeadingElement>
		h5: HTMLElementAttributes<HTMLHeadingElement>
		h6: HTMLElementAttributes<HTMLHeadingElement>
		main: HTMLElementAttributes<HTMLElement>
		nav: HTMLElementAttributes<HTMLElement>
		section: HTMLElementAttributes<HTMLElement>

		// Grouping content
		blockquote: BlockquoteElementAttributes
		div: HTMLElementAttributes<HTMLDivElement>
		dl: HTMLElementAttributes<HTMLDListElement>
		dt: HTMLElementAttributes<HTMLElement>
		dd: HTMLElementAttributes<HTMLElement>
		figcaption: HTMLElementAttributes<HTMLElement>
		figure: HTMLElementAttributes<HTMLElement>
		hr: HTMLElementAttributes<HTMLHRElement>
		li: LiElementAttributes
		ol: OlElementAttributes
		p: HTMLElementAttributes<HTMLParagraphElement>
		pre: HTMLElementAttributes<HTMLPreElement>
		ul: HTMLElementAttributes<HTMLUListElement>

		// Text-level semantics
		a: AnchorElementAttributes
		abbr: HTMLElementAttributes<HTMLElement>
		b: HTMLElementAttributes<HTMLElement>
		bdi: HTMLElementAttributes<HTMLElement>
		bdo: HTMLElementAttributes<HTMLElement>
		br: HTMLElementAttributes<HTMLBRElement>
		cite: HTMLElementAttributes<HTMLElement>
		code: HTMLElementAttributes<HTMLElement>
		data: DataElementAttributes
		dfn: HTMLElementAttributes<HTMLElement>
		em: HTMLElementAttributes<HTMLElement>
		i: HTMLElementAttributes<HTMLElement>
		kbd: HTMLElementAttributes<HTMLElement>
		mark: HTMLElementAttributes<HTMLElement>
		q: QElementAttributes
		rp: HTMLElementAttributes<HTMLElement>
		rt: HTMLElementAttributes<HTMLElement>
		ruby: HTMLElementAttributes<HTMLElement>
		s: HTMLElementAttributes<HTMLElement>
		samp: HTMLElementAttributes<HTMLElement>
		small: HTMLElementAttributes<HTMLElement>
		span: HTMLElementAttributes<HTMLSpanElement>
		strong: HTMLElementAttributes<HTMLElement>
		sub: HTMLElementAttributes<HTMLElement>
		sup: HTMLElementAttributes<HTMLElement>
		time: TimeElementAttributes
		u: HTMLElementAttributes<HTMLElement>
		var: HTMLElementAttributes<HTMLElement>
		wbr: HTMLElementAttributes<HTMLBRElement>

		// Edits
		del: InsDelElementAttributes
		ins: InsDelElementAttributes

		// Embedded content
		img: ImageElementAttributes
		iframe: IframeElementAttributes
		embed: EmbedElementAttributes
		object: ObjectElementAttributes
		picture: GlobalAttributes<HTMLPictureElement>
		source: SourceElementAttributes
		track: TrackElementAttributes
		video: VideoElementAttributes
		audio: AudioElementAttributes
		map: MapElementAttributes
		area: AreaElementAttributes
		canvas: CanvasElementAttributes
		noscript: HTMLElementAttributes<HTMLElement>

		// Scripting
		script: ScriptElementAttributes
		template: GlobalAttributes<HTMLTemplateElement>
		slot: SlotElementAttributes

		// Tables
		table: TableElementAttributes
		caption: HTMLElementAttributes<HTMLTableCaptionElement>
		colgroup: ColGroupElementAttributes
		col: ColElementAttributes
		tbody: HTMLElementAttributes<HTMLTableSectionElement>
		thead: HTMLElementAttributes<HTMLTableSectionElement>
		tfoot: HTMLElementAttributes<HTMLTableSectionElement>
		tr: HTMLElementAttributes<HTMLTableRowElement>
		th: ThElementAttributes
		td: TdElementAttributes

		// Forms
		form: FormElementAttributes
		label: LabelElementAttributes
		input: InputElementAttributes
		textarea: TextAreaElementAttributes
		select: SelectElementAttributes
		option: OptionElementAttributes
		optgroup: OptGroupElementAttributes
		button: ButtonElementAttributes
		fieldset: FieldsetElementAttributes
		legend: HTMLElementAttributes<HTMLLegendElement>
		output: OutputElementAttributes
		progress: ProgressElementAttributes
		meter: MeterElementAttributes
		datalist: HTMLElementAttributes<HTMLDataListElement>

		// Interactive
		details: DetailsElementAttributes
		summary: HTMLElementAttributes<HTMLElement>
		dialog: DialogElementAttributes

		// SVG
		svg: SvgElementAttributes
		[key: `svg:${string}`]: GlobalAttributes<SVGElement> & Record<string, any>
	}
	export interface ElementChildrenAttribute {
		children: {}
	}
	export interface Element extends globalThis.Element {}
	export interface ElementClass {
		htmlRoot: Element | null
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
