# ThreeJS_III

## Core

### III_SPACE | ThreeJS_III output

```
|----------------------|
|      III_SPACE       |
|----------------------|
|   - camera           |
|   - renderer         |
|   - scene            |
|   - loop             |
|   - controls         |
|   - container        |
|   - physics          |
|----------------------|
|   + #initSystems()   |
|   + background()     |
|   + lights()         |
|   + axis()           |
|   + addObject()      |
|   + render()         |
|   + start()          |
|   + stop()           |
|----------------------|
```

### III_SCENE | Factory of THREE.Scene

```
|-----------------------|
|      III_SCENE        |
|-----------------------|
|    - BGType           |
|-----------------------|
|    + setBG()          |
|    + #_BOX_           |
|-----------------------|
```

### Loop

Manage the animation loop and the render.

```
|-----------------------|
|       Loop            |
|-----------------------|
|    - camera           |
|    - scene            |
|    - renderer         |
|-----------------------|
|    + add()            |
|    + start()          |
|    + stop()           |
|    + #nextFrame()     |
|-----------------------|
```

### III_CONTROLS_ | Factory of THREE.OrbitControls

```
|-----------------------|
|    III_CONTROLS_      |
|-----------------------|
|   + nextFrame()       |
|   + removeControls()  |
|-----------------------|
```

### Resizer

Manage the render resize event.

```
|-----------------------|
|       Resizer         |
|-----------------------|
```