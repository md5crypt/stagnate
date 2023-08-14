# Stagnate

> React but not reactive, lol

This project started basically as an meme. Yet somehow it ended up being a very useful tool for creating small web apps.

The basic idea is very simple and can be explained in one sentence:
> react but components get rendered only once

This throws out the need for any vDOM as you never need to mutate any already rendered component. Thanks to that components can get rendered directly into DOM in a single pass.

Well... but how do you update anything then? Manually. References to created JSX elements get stored inside the component class for further use.

This library has no dependencies and is simple as it can gets (it's literally ~300 lines of code). For me it's my goto thing when working on smaller things.

## Setup

Intended to be used with typesciprt.

1. npm install stagnate
2. add the following to `compilerOptions` in `tsconfig.json`
```json
{
	"jsx": "react-jsx",
	"jsxImportSource": "stagnate"
}
```

That's it. JSX can now be used within `.tsx` files added to the typescript project.

## Function components

Function components work like in react minus the fact that they don't have any kind of hooks. Because there is no vDOM, calling a function component from code will leave you with a pain HTMLElement.

## Class components

Class components have a simple lifecycle that includes `onAttach` and `onDetach` function calls but there is a major caveat to remember: DOM is not being watched in any way so a component needs to be informed by another already attached component that it has been attached. Same applies to `onDetach`. For it to be called the component needs to know it has been destroyed.

Both of the above can be achieved by correctly binding child components to parent components via `ref` JSX attributes or by manually creating components from code.

### Component root element

Each class component has a single root HTML element. This value is set to the value returned from the `render` function and saved as a protected class property called `root`.

### Properties

Properties are passed as an object in component constructor and available as a readonly `props` class property. They are not used for anything internally, they are simply there to hold attributes passed from JSX.

### Refs object, ref member function and JSX ref attribute

`refs` component class property hold references to all HTML elements and child components that had `ref` JSX attribute set. See example below for a better explanation:

```typescript
class Example extends Component<{foo: HTMLDivElement}> {
	render() {
		return <div>
			<span ref={this.ref("foo")} />
		</div>
	}
}
```

In the example above `this.refs.foo` will point to the `<span>` element (`HTMLSpanElement` instance).

The JSX `ref` attribute works exactly like in react, it accepts a callback with a single argument that gets called when the element / component is created. The value of that argument is a reference to the crated element or (for class components) the created component instance.

The `Component.ref` member function returns a callback to be set as the `ref` JSX attribute. The string argument for that function sets the name under which it should be saved in the `refs` object. For class components it also sets the parent of the created component. It can also be called without argument to just set the parent without saving it under `refs`.

> When using class components in JSX it is important to always bind them or else the `onAttach` / `onDetach` functions will never be called.
>
> For example let's say `Foo` is a class component that has an `onAttach` function defined. We want to use it inside `Bar` component's render function but we don't want it saved under `refs`. What we should do is `<Foo ref={this.ref()} />`. Writing `<Foo />` would crate the component and insert it to DOM, but would never call `onAttach` as the parent would be left unset.

### Creating component programmatically

Three member methods can be used to add (attach) a component into DOM.

#### The `create` member function

```typescript
create(parent: Component, target?: Element | Component | null, before?: Element | Component | number)
```

This method immediately renders the component and appends it to `target`. The component's parent is set to `parent` and the component get's registers as `parent's` child.

If `parent` is attached `onAttach` will be called immediately, if not it will be called once `parent` is attached.

If `target` is `null` then `parent.root` element will be used as `target`.

If `before` is set the element will be inserted before that element.

#### The `replace` member function

```typescript
replace(parent: Component, target: Element | Component)
```

Same as `create` but replaces `target` instead of being appended to it.

#### The `createOrphanized` member function

```typescript
createOrphanized(target?: Element | null)
```

Same as `create` but intended to create the root component. The component is automatically set as attached after render.

If `target` is `null` then component is appended to `document.body`.

## JSX attribute handling

### `ref` attribute

Callback with a single argument that gets called when the element / component is created. The value of that argument is a reference to the crated element or (for class components) the created component instance.

### `class` attribute

In contrast to react `class` in used instead of `className`. What's more the value can be an array. The passed array will be flattened, filtered and then joined to create a single string. This allows writing things like `class={["class1", condition && "class2"]}` without and additional functions or libraries.

### `innerHTML` attribute

It will simply set innerHTML.

### `style` attribute

Does `Object.assign(element.style, value)`

### Event attributes

Every attribute starting with `on` will be treated as an event callback and added using `addEventListener`.

### Other attributes

1. If value is `true` then `setAttribute(attribute, "")` gets called.
2. If value is `false` or `null` then `removeAttribute(attribute)` gets called.
3. If value is a string then `setAttribute(attribute, value)` gets called.
4. if value is `undefined` the attribute is ingored and nothing happens 
5. for all other values `setAttribute(attribute, value.toString())` gets called

## JSX special elements

### `<text>` element

The `<text>` element creates a `Text` node that can be used to bind a `Text` node to component `refs`.

### `<>` element (aka `<Fragment>`)

Same as in react, used to return a array of parents without a root. One thing to remember is that it **does not return a HTMLElement** and should never be used as an component root.

### Slots

Basic slot functionality, see example below:

```typescript
class Layout extends Component<{}, {children: StagnateNode}> {
	render() {
		const slots = Slot.extract<{foo: HTMLElement, bar: HTMLElement}>(this.props.children)
		return <div>
			<div>{slots.foo}</div>
			<div>{slots.bar}</div>
		</div>
	}
}

// <Slot> elements have to be direct children to work
const example = <Layout>
	<Slot name="foo">FOO</Slot>
	<Slot name="bar">BAR</Slot>
</Layout>
```

Primary used to avoid passing nested JSX elements as props.

## Api reference

### Component class
```typescript
declare class Component<REFS = {}, PROPS = undefined, ROOT extends SVGElement | HTMLElement = SVGElement | HTMLElement> {
	// props from JSX (set via constructor)
	readonly props: PROPS extends undefined ? {} : PROPS
	// HTML root element of this component (can be not set if not attached)
	protected root: ROOT
	// parent of this component (can be not set if not attached)
	protected parent: Component<any, any>
	// the refs object containing bound elements created during render
	protected refs: REFS
	// overcomplicated constructor signature made so props is optional only if component has no props defined
	constructor(...props: PROPS extends undefined ? [] : [never])
	// the render function, called to get the component root element, null can be returned if component
	// has nothing to render but will result with exception if component is being created via create or replace
	protected render(): Element | null
	// the ref callback generation function with a overcomplicated signature, used to bind JSX elements to refs
	protected ref<T extends keyof REFS | undefined = undefined>(key?: T): (x: REFS[NonNullable<T>] extends never ? any : REFS[NonNullable<T>]) => void
	// create component and replace target element
	replace(parent: Component<any, any>, target?: Element | Component<any, any> | null): void
	// create component and insert to target
	create(parent: Component<any, any>, target?: Element | Component<any, any> | null, before?: Element | Component<any, any> | number): void
	// crate component as root (attached set on creation)
	createOrphanized(target?: Element | null): void
	// bind component to a already existing element (called internally on JSX ref binding)
	bind(parent: Component<any, any>, target?: Element): void
	// destroy component and it child components
	destroy(): void
	// check if component is attached
	get attached(): boolean
	// get the root element of this component
	get htmlRoot(): ROOT;
	// get and array of child components
	protected get components(): Readonly<Component<any, any, any>[]>
	// called before render is called
	protected onBeforeRender(): void
	// called after render is called
	protected onRender(): void
	// called when parent becomes attached (or on parent assignment if parent is attached)
	protected onAttach(): void
	// called when element is destroyed
	protected onDetach(): void;
}

```

### Utility Types

```typescript
// get props of an JSX element or component function / class
type ComponentProps<IntrinsicElement | ClassElement | FunctionElement>
// anything that can be legally used in JSX
type StagnateNode
// the JSX element css class attribute
type ClassAttribute
```

### Other exports

* `Fragment` - the Fragment JSX component, `<>` can be used as an alias
* `Slot` - the Slots JSX component
* `Slot.extract` - function to extract slots from children (`props.children`)
* `createElement` - can be used if for some reason react-jsx can not be used
* `jsx / jsxs` - exports for react-jsx