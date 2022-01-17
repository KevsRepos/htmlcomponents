# HTMLCOMPONENTS 💪

**This small library is not really suitable for production**

Instead - its just a little "I wanted to try that out" and an Idea of what html5 could natively have.

I'm talking about native components. Such as:

```html
<template comp="mycomponent" number="default number">
    <p>This is a component! {number}</p>
</template>

<mycomponent number="1" />
<mycomponent number="2" />
<mycomponent />
```

Output:

```
This is a component! 1

This is a component! 2

This is a component! default number
```

---

Native syntax like that would bring a lot new possibilities to html. Especially the possibility to have a bit more complex html structures without the need of javascript.

Due to limitiations of how browsers work, I could not recreate this behaviour exactly the same.

# Usage

**Creating a component**

We use whats already there - the `<template>` tag. To tell our library that this should be used as a component template, provide the attribute `comp`. 

Important node: You can pass a string like "button", which
is already an existing HTMLElement. To avoid inconsistency, the libary will only search for elements with an underscore at the end. (E.g):

`<customcomp_></customcomp_>`

Browsers always lowercase html elements, the hyphen is reserved for shadow-elements and any other methods are not recognised as html elements.

Sadly, no matter what, its not possible to create self closing tags, browsers always transform them into normal tags:

`<customcomp />` will be transformed to `<customcomp></customcomp>`

using selfclosing tags on components will cause bugs!

---

**props**

components can take props as you may know it from frameworks like svelte/react/vue. If a prop must be given, its enough define the prop without any quotation marks:

```html
<template comp="mycomp" text headline="Welcome">

</template>
```
"text" here is an expected prop. If its not passed, error will be thrown.

"headline" on the other hand must not be passed. If not, it will fallback to the default value.

props are values that dynamic placeholders inside the html structure. To use them inside the html:

```html
<template comp="mycomp" text>
    {text}
    {notaprop}
</template>

<mycomp_ text="Hello World!"></mycomp_>
```

`text` will be replaced with "Hello World". `notaprop` will just stay as is and not be replaced.

---

**slots**

These components can also take children:

```html
<template comp="helloworld">
    <slot name="hello"></slot>
    great
    <slot name="world">Human!</slot>
</template>

<helloworld_>
    <span prop="hello">Hello</span>
</helloworld_>
```

What we see here, is the option to directly pass children. The behaviour of this feature is inspired by svelte. (I dont know where svelte got the inspiration from).

Elements with the `prop` attribute will be replaced with the slot attribute matching the value of `name`. If a component does not provide an element with such a `prop` attribte, a fallback will catch it, which is the children of the slot tag. If the slot tag has no children, error will be thrown.

# Thats it

As of now - thats it. This lib is imperformant currently. I may try to increase performance. But after all - Its not really that useful and probably full of bugs and unexpected behaviour.

It would be much more useful, if something like this was natively integrated into html.