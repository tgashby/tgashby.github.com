(function (window, undef) {

    // Keep track of current ID for next entity
    var currEntID = 1;

    // All the objects/components/events registered
    var components = {}, entities = {}, events = {};

    // Game speed variables
    var fps = 60, currFrame = 1;
    var tick, loops = 0, milliPerFrame = 1000 / fps, nextTick = (new Date()).getTime();

    var Goomba = function (selector) {
        return new Goomba.fn.init(selector);
    }

    Goomba.prototype = {
        init: function (selector) {
            // By component
            if (typeof selector === "string") {
                var len = 0, delimiter, and = false, or = false, e, currEnt, comps;

                if (selector === '*') {
                    for (e in entities) {
                        this[e] = entities[e];
                        len++;
                    }

                    this.length = len;
                    return this;
                };

                if (selector.indexOf(',') !== -1) {
                    or = true;
                    delimiter = /\s*,\s*/;
                } else if (selector.indexOf(' ') !== -1) {
                    and = true;
                    delimiter = /\s+/;
                }

                for (e in entities) {
                    if (!entities.hasOwnProperty(e))
                        continue;

                    currEnt = entities[e];

                    if (and || or) {
                        comps = selector.split(delimiter);
                        cLen = comps.length;
                        score = 0;

                        for (var i = 0; i < cLen; i++) {
                            if (currEnt.m_comps[comps[i]]) {
                                score++;
                            };

                            if (and && score == cLen || or && score > 0) {
                                this[len] = e;
                                len++;
                            };
                        };
                    } else if (currEnt.m_comps[selector]) {
                        this[len] = currEnt;
                        len++;
                    }
                }

                if (len > 0 && !and && !or) {
                    this.extend(components[selector]);
                };

                if (comps && and) {
                    for (var i = 0; i < cLen; i++) {
                        this.extend(components[comps[i]]);
                    };
                };

                this.length = len;

            } else { // By ID
                if (!selector) {
                    selector = 0;

                    if (!(selector in entities)) {
                        entities[selector] = this;
                    };
                };

                if (!(selector in entities)) {
                    this.length = 0;
                    return this;
                };

                this['id'] = selector;
                this.length = 1;

                if (!this.m_comps) {
                    this.m_comps = {};
                };

                if (!entities[selector]) {
                    entities[selector] = this;
                };

                return entities[selector];
            };

            return this;
        },

        addComponent: function (comp) {
            var comps = [comp];

            if (comp.indexOf(',') !== -1) {
                comps = comp.split(/\s*,\s*/);
            }

            for (var i = 0; i < comps.length; i++) {
                this.m_comps[comps[i]] = true;

                this.extend(components[comps[i]]);

                if (components[comps[i]] && "init" in components[comps[i]]) {
                    components[comps[i]].init.call(this);
                };
            }

            return this;
        },

        removeComponent: function (comp) {
            for (var p in components[comp]) {
                delete this[p];
            }

            delete this.m_comps[comp];

            return this;
        },

        requiresComponent: function (comp) {
            this.addComponent(comp);

            return this;
        },

        hasComponent: function (comp) {
            return this.m_comps[comp];
        },

        addAttrs: function (attr) {
            this.extend(attr);

            return this;
        },

        bindEvent: function (event, cb) {
            this.forEach(function () {
                if (!events[event]) {
                    events[event] = {};
                }

                var ev = events[event];

                if (!ev[this.id]) {
                    ev[this.id] = [];
                };

                ev[this.id].push(cb);
            });

            return this;
        },

        triggerEvent: function (event, params) {
            this.forEach(function () {
                if (events[event] && events[event][this.id]) {
                    var cb = events[event][this.id];

                    for (var i = 0; i < cb.length; i++) {
                        cb[i].call(this, params);
                    };
                };
            });

            return this;
        },

        forEach: function (cb) {
            if (this.length === 1) {
                cb.call(this, 1);
            };

            for (var i = 0; i < this.length; i++) {
                if (!entities[this[i]]) {
                    continue;
                };

                cb.call(entities[this[i]], i);
            }

            return this;
        },

        // Some sugar
        onUpdate: function (cb) {
            this.bindEvent("Update", cb);

            return this;
        },

        controls: function (bindings) {
            var x = this;

            for (var key in bindings) {
                if (bindings.hasOwnProperty(key)) {
                    var f = (function (k) {
                        return function () {
                            if (Goomba.keyboard.state[Goomba.keyboard.keys[k]]) {
                                bindings[k].call(x);
                            }
                        };
                    })(key);

                    this.bindEvent("Update", f);
                };
            }

            return this;
        },

        mouseControls: function (bindings) {
            var x = this;

            for (var button in bindings) {
                if (bindings.hasOwnProperty(button)) {
                    var f = (function (b) {
                        return function () {
                            if (Goomba.mouse.state[Goomba.mouse.buttons[b]] &&
                                Goomba.mouse.onEntities.indexOf(this.id) !== -1) {
                                bindings[b].call(x);
                            };
                        }
                    })(button);

                    this.bindEvent("Update", f);
                };
            }

            return this;
        }
    };

    Goomba.fn = Goomba.prototype;

    Goomba.fn.init.prototype = Goomba.fn;

    Goomba.fn.extend = function (obj) {
        var key;

        if (!obj) {
            return this;
        };

        for (key in obj) {
            if (this === obj[key])
                continue;

            this[key] = obj[key]
        }

        return this;
    };

    Goomba.extend = Goomba.fn.extend;

    // Timer
    Goomba.extend({
        timer: {
            prev: (Number(new Date)),
            current: (Number(new Date)),
            currTime: Date.now(),

            init: function () {
                var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;

                if (animFrame) {
                    tick = function () {
                        Goomba.timer.step();
                        animFrame(tick);
                    }

                    tick();

                } else {
                    tick = setInterval(Goomba.timer.step, milliPerFrame);
                }
            },

            step: function () {
                loops = 0;
                this.currTime = Date.now();

                if (this.currTime - nextTick > 60 * milliPerFrame) {
                    nextTick = this.currTime - milliPerFrame;
                };

                while (this.currTime > nextTick) {
                    Goomba.triggerEvent("Update", { currFrame: currFrame++ });
                    nextTick += milliPerFrame;
                    loops++;
                }

                if (loops) {
                    Goomba.draw();
                };
            }
        }
    });

    // Drawing/Loading
    Goomba.extend({
        assets: {},

        draw: function () {
            var cvs = Goomba.canvas;
            var ctx = cvs.context;

            ctx.clearRect(0, 0, cvs.w, cvs.h);

            ctx.save();
            ctx.translate(-1 * Goomba.viewport.x, -1 * Goomba.viewport.y);

            for (var id in entities) {
                if (entities.hasOwnProperty(id)) {
                    var e = entities[id];

                    if (!e.draw) {
                        console.log("Cannot draw entity: " + e + ", no draw method");
                        continue;
                    };

                    ctx.save();
                    e.draw(ctx);
                    ctx.restore();
                };
            }

            ctx.restore();
        },

        load: function (data, finishedCB) {
            var loadCount = 0;
            var n = Object.keys(data).length;

            if (!Goomba.audio.loaded) {
                Goomba.audio.init();
            }

            function assetLoaded() {
                loadCount++;

                if (loadCount == n) {
                    finishedCB();
                }
            }

            for (var name in data) {
                var url = data[name];

                var ext = url.substr(url.lastIndexOf('.') + 1).toLowerCase();

                if (Goomba.audio.supported[ext]) {
                    this.assets[name] = new Audio(name);
                    this.assets[name].id = url.substr(url.lastIndexOf('/') + 1).toLowerCase();
                    this.assets[name].preload = "auto";

                    // Audio elemnts don't have an onload, cheat and increment anyway
                    loadCount++;

                } else if (Goomba.images.supported[ext]) {
                    this.assets[name] = new Image();
                    this.assets[name].onload = assetLoaded;
                } else {
                    console.log("Unsupported ext: " + ext + " on file: " + url);
                    return;
                }

                this.assets[name].src = url;

                this.assets[name].onerror = function () { console.log("Error with " + name); };
            }
        },

        splitSprite: function (image, spriteW, spriteH, frames) {
            image.spriteWidth = spriteW;
            image.spriteHeight = spriteH;

            for (var key in frames) {
                image[key] = frames[key];
            };

            return this;
        },

        audio: {
            supported: {},
            loaded: false,
            codecs: {
                ogg: 'audio/ogg; codecs="vorbis"',
                wav: 'audio/wav; codecs="1"',
                mp3: 'audio/mpeg; codecs="mp3"',
                m4a: 'audio/mp4; codecs="m4a.40.2"'
            },

            init: function () {
                var audio = new Audio("");

                for (var type in this.codecs) {
                    var playable = audio.canPlayType(this.codecs[type]);

                    if (playable !== "" && playable !== "no") {
                        this.supported[type] = true;
                    } else {
                        this.supported[type] = false;
                    }
                }

                this.loaded = true;
            }
        },

        images: {
            supported: {
                jpg: true,
                jpeg: true,
                gif: true,
                png: true
            }
        }
    });

    // Input
    Goomba.extend({
        keyboard: {
            keys: {
                BACKSPACE: 8,
                TAB: 9,
                ENTER: 13,
                SHIFT: 16,
                CTRL: 17,
                ALT: 18,
                PAUSE: 19,
                CAPS: 20,
                ESC: 27,
                SPACE: 32,
                PAGE_UP: 33,
                PAGE_DOWN: 34,
                END: 35,
                HOME: 36,
                LEFT_ARROW: 37,
                UP_ARROW: 38,
                RIGHT_ARROW: 39,
                DOWN_ARROW: 40,
                INSERT: 45,
                DELETE: 46,
                0: 48,
                1: 49,
                2: 50,
                3: 51,
                4: 52,
                5: 53,
                6: 54,
                7: 55,
                8: 56,
                9: 57,
                A: 65,
                B: 66,
                C: 67,
                D: 68,
                E: 69,
                F: 70,
                G: 71,
                H: 72,
                I: 73,
                J: 74,
                K: 75,
                L: 76,
                M: 77,
                N: 78,
                O: 79,
                P: 80,
                Q: 81,
                R: 82,
                S: 83,
                T: 84,
                U: 85,
                V: 86,
                W: 87,
                X: 88,
                Y: 89,
                Z: 90,
                LEFT_WIN_KEY: 91,
                RIGHT_WIN_KEY: 92,
                SELECT: 93,
                NUMPAD_0: 96,
                NUMPAD_1: 97,
                NUMPAD_2: 98,
                NUMPAD_3: 99,
                NUMPAD_4: 100,
                NUMPAD_5: 101,
                NUMPAD_6: 102,
                NUMPAD_7: 103,
                NUMPAD_8: 104,
                NUMPAD_9: 105,
                MULTIPLY: 106,
                ADD: 107,
                SUBSTRACT: 109,
                DECIMAL: 110,
                DIVIDE: 111,
                F1: 112,
                F2: 113,
                F3: 114,
                F4: 115,
                F5: 116,
                F6: 117,
                F7: 118,
                F8: 119,
                F9: 120,
                F10: 121,
                F11: 122,
                F12: 123,
                NUM_LOCK: 144,
                SCROLL_LOCK: 145,
                SEMI_COLON: 186,
                EQUALS: 187,
                COMMA: 188,
                MINUS: 189,
                PERIOD: 190,
                FWD_SLASH: 191,
                GRAVE: 192,
                OPEN_BRACKET: 219,
                BCK_SLASH: 220,
                CLOSE_BRACKET: 221,
                QUTOTE: 222
            },

            state: {}
        },

        mouse: {
            buttons: {
                LEFT: 0,
                MIDDLE: 1,
                RIGHT: 2
            },

            state: {},

            position: {},

            onEntities: []
        }
    });

    //Entities
    Goomba.extend({
        newEntity: function () {
            var id = UID();
            var ent;

            entities[id] = null;

            ent = Goomba(id);
            entities[id] = ent;

            // If we have properties
            if (arguments.length > 0) {
                ent.addComponent.apply(ent, arguments);
            };

            if (!ent.draw) {
                ent.addComponent("Color");
            };

            return ent;
        },

        newComponent: function (name, funcs) {
            components[name] = funcs;
        },

        triggerEvent: function (event, params) {
            var evts = events[event];

            for (var ev in evts) {
                if (!evts.hasOwnProperty(ev)) {
                    continue;
                }

                for (var i = 0; i < evts[ev].length; i++) {
                    if (evts[ev] && evts[ev][i]) {
                        if (entities[ev]) {
                            evts[ev][i].call(Goomba(+ev), params);
                        } else {
                            evts[ev][i].call(Goomba, params);
                        }
                    };
                }
            }

            return this;
        },

        bindEvent: function (event, cb) {

            if (!events[event]) {
                events[event] = {};
            };

            var ev = events[event];

            if (!ev.global) {
                ev.global = [];
            };

            ev.global.push(cb);

            return ev.global.length - 1;
        },

        removeEntity: function (id) {
            for (var ev in events) {
                if (events[ev][id]) {
                    delete events[ev][id];

                    events[ev][id] = {};
                    events[ev][id].length = 0;
                };
            }

            delete entities[id];

            return this;
        },

        isComponent: function (comp) {
            return comp in components;
        }
    });

    // States
    Goomba.extend({
        states: {},
        currState: null,

        // With just 'name', state is switched, otherwise just created
        state: function (name, start, end) {

            // Changing to new state
            if (arguments.length === 1) {
                if (this.currState !== null && 'end' in this.currState) {
                    this.currState.end.call(this);
                };

                for (var e in entities) {
                    if (!entities.hasOwnProperty(e)) {
                        continue;
                    };

                    var currEnt = entities[e];

                    for (var ev in events) {
                        if (!events.hasOwnProperty(ev)) {
                            continue;
                        };

                        if (events[ev][currEnt.id]) {
                            delete events[ev][currEnt.id];

                            // HACK, Don't know why this is needed.
                            events[ev][currEnt.id] = {};
                            events[ev][currEnt.id].length = 0;
                        };
                    }
                }

                entities = {};

                this.states[name].start.call(this);
                this.currState = this.states[name];

                return this;
            };

            // Adding a state
            this.states[name] = {};
            this.states[name].start = start;

            if (arguments.length === 3) {
                this.states[name].end = end;
            };

            return this;
        }
    });

    function UID() {
        var newID = currEntID++;

        if (newID in entities) {
            return UID();
        }

        return newID;
    }

    Goomba.newComponent("Collidable", {
        bounds: null,

        init: function () {

        },

        setBounds: function (poly) {
            if (!poly) {
                this.bounds = { x: 0, y: 0, w: this.w, h: this.h };
            } else {
                this.bounds = poly;
            }

            return this;
        },

        getCollisions: function (comp) {
            if (!this.bounds) {
                this.setBounds();
            };

            var collisions = [];

            for (var ent in entities) {
                if (!entities[ent].m_comps[comp]) {
                    continue;
                };

                var currEnt = entities[ent];

                if (collides(this, currEnt)) {
                    collisions.push(currEnt);
                };
            }

            if (collisions.length === 0) {
                return false;
            };

            return collisions;
        },

        onHit: function (comp, cb) {
            this.bindEvent("Update", function () {
                var collisions = this.getCollisions(comp);

                if (collisions) {
                    cb.call(this, collisions);
                };
            });

            return this;
        }
    });

    function collides(a, b) {
        return a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y;
    }

    Goomba.bindEvent("KeyUp", function (event) {
        Goomba.keyboard.state[event.keyCode] = false;
    });

    Goomba.bindEvent("KeyDown", function (event) {
        Goomba.keyboard.state[event.keyCode] = true;
    });

    Goomba.bindEvent("MouseUp", function (event) {
        Goomba.mouse.state[event.button] = false;
    });

    Goomba.bindEvent("MouseDown", function (event) {
        Goomba.mouse.state[event.button] = true;
    });

    Goomba.bindEvent("MouseMove", function (event) {
        Goomba.mouse.position = { x: event.offsetX, y: event.offsetY };

        Goomba.mouse.onEntities.splice(0, Goomba.mouse.onEntities.length);

        for (var e in entities) {
            if (entities.hasOwnProperty(e)) {
                var currEnt = entities[e];

                var mousePos = Goomba.mouse.position;

                // Hacky way to use the existing collision code
                mousePos.w = 1;
                mousePos.h = 1;

                if (collides(mousePos, currEnt)) {
                    Goomba.mouse.onEntities.push(currEnt.id);
                };
            };
        };
    });

    window.addEventListener('keyup', function (event) {
        Goomba.triggerEvent("KeyUp", event);
    }, false);

    window.addEventListener('keydown', function (event) {
        Goomba.triggerEvent("KeyDown", event);
    }, false);

    window.addEventListener('mousedown', function (event) {
        Goomba.triggerEvent("MouseDown", event);
    }, false);

    window.addEventListener('mouseup', function (event) {
        Goomba.triggerEvent("MouseUp", event);
    }, false);

    window.addEventListener('mousemove', function (event) {
        Goomba.triggerEvent("MouseMove", event);
    });

    window.Goomba = Goomba;
})(window);

(function (Goomba, window, document) {
    Goomba.extend({
        viewport: {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        },

        canvas: {
            context: null,
            w: null,
            h: null,
            elem: null,

            init: function (w, h) {
                var cv;

                cv = document.createElement("canvas");
                cv.width = w;
                cv.height = h;
                cv.style.position = 'relative';
                cv.style.left = "0px";
                cv.style.top = "0px";

                document.body.appendChild(cv);
                Goomba.canvas.elem = cv;
                Goomba.canvas.context = cv.getContext('2d');
                Goomba.canvas.w = w;
                Goomba.canvas.h = h;
            }
        },

        background: function (value) {
            Goomba.canvas.elem.style.background = value;
        },

        init: function (w, h) {
            Goomba.viewport.w = w;
            Goomba.viewport.h = h;

            if (!Goomba.canvas.context) {
                Goomba.canvas.init(w, h);
            };

            Goomba.timer.init();
        }
    });
})(Goomba, window, window.document);

Goomba.newComponent("Color", {
    init: function () {
        this.draw = function (ctx) {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = this.color || '#8ED6FF';
            ctx.fill();
            ctx.strokeStyle = "none";
            ctx.stroke();
        }
    }
});

Goomba.newComponent("Image", {
    init: function () {
        this.draw = function (ctx) {
            if (this.img) {
                ctx.drawImage(this.img, this.x, this.y);
            }
        }
    },

    setImg: function (image) {
        this.img = image;

        this.w = this.img.width;
        this.h = this.img.height;

        return this;
    }
});

Goomba.newComponent("Scoreboard", {
    init: function () {
        this.draw = function (ctx) {
            ctx.font = this.font || "normal 12px Verdana";
            ctx.fillText(this.text + this.score, this.x, this.y);
        }
    }
});

Goomba.newComponent("Text", {
    init: function () {
        this.draw = function (ctx) {
            ctx.font = this.font || "normal 12px Verdana";
            ctx.fillText(this.text, this.x, this.y);
        }
    }
});

Goomba.newComponent("Animation", {
    init: function () {
        this.draw = function (ctx) {
            if (!this.img) {
                console.log("No image associated with animation entity");
                return;
            };

            this.animate(Date.now()); // Timestamp inside?

            ctx.save();
            ctx.translate(this.x, this.y);

            if (this.flip) {
                ctx.scale(-1, 1);
                ctx.translate(-this.w, 0);
            };

            ctx.drawImage(this.img, (this.frame % this.cellsWide) * this.w, Math.floor(this.frame / this.cellsWide) * this.h, this.w, this.h, 0, 0, this.w, this.h);
            ctx.restore();
        }
    },

    setImg: function (image) {
        this.img = image;

        this.flip = false;
        this.cellsWide = this.img.naturalWidth / this.img.spriteWidth;
        this.frame = 0;
        this.currAnim = null;
        this.lastFrame = null;

        this.w = this.img.spriteWidth;
        this.h = this.img.spriteHeight;

        return this;
    },

    setAnimation: function (animation) {
        if (this.currAnim !== animation) {
            this.currAnim = animation;
            this.lastFrame = null;
            if (this.currAnim) {
                this.frame = 0;
            };
        };

        return this;
    },

    resetAnimation: function (animation) {
        if (this.currAnim === animation) {
            this.lastFrame = null;
            this.frame = 0;
        } else {
            this.setAnimation(animation);
        }
    },

    animate: function (timestamp) {
        if (!this.currAnim) {
            return this;
        };

        var anim = this.img[this.currAnim];
        if (!this.lastFrame) {
            this.frame = anim.start;
            this.lastFrame = timestamp;
            return this;
        };

        var delta = 1.0 / anim.fps * 1000;
        if (timestamp - this.lastFrame > delta) {
            this.frame++;
            if (this.frame > anim.end) {
                this.frame = anim.start;
            };

            this.lastFrame += delta;
            return this;
        }

        return this;
    }
});

Goomba.newComponent("Interactive", {
    init: function () {
        this.requiresComponent("Collidable");
    },

    onInteract: function (comp, cb) {
        this.onHit(comp, cb);
    }
});

Goomba.newComponent("Gravity", {
    gravConst: 0.5,
    yVel: 0,
    falling: true,
    gravComp: null,

    init: function () {
        this.requiresComponent("Collidable");
    },

    gravitateTo: function (comp) {
        if (comp) {
            this.gravComp = comp;
        } else {
            this.gravComp = "";
        }

        this.bindEvent("Update", function () {
            if (this.falling) {
                this.yVel += this.gravConst;
            }

            this.y += this.yVel;

            var collisions = this.getCollisions(this.gravComp);

            if (collisions) {
                this.stopFalling(collisions);
            } else {
                this.falling = true;
            }
        });

        return this;
    },

    setGravityConst: function (newConst) {
        this.gravConst = newConst;

        return this;
    },

    stopFalling: function (collisions) {
        if (collisions) {
            var xOnLeft = this.x < collisions[0].x,
                xOnRight = this.x > collisions[0].x + collisions[0].w,
                wOnLeft = this.x + this.w < collisions[0].x,
                wOnRight = this.x + this.w > collisions[0].x + collisions[0].w,
                xWithin = !xOnLeft && !xOnRight,
                wWithin = !wOnLeft && !wOnRight,
                yAbove = this.y < collisions[0].y,
                yBelow = this.y > collisions[0].y,
                allAbove = this.y + this.h < collisions[0].y,
                allBelow = yBelow,
                yWithin = !allAbove && !allBelow;

            // If within the entity, no need to worry about being on it's sides
            if (xWithin && wWithin) {
                // If above it
                if (yAbove) {
                    this.y = collisions[0].y - this.h;
                    this.falling = false;
                }

                // If below it
                if (yBelow) {
                    this.y = collisions[0].y + collisions[0].h;
                }

                this.yVel = 0;

            } else {
                // If to the right of it
                if (wOnRight) {
                    this.x = collisions[0].x + collisions[0].w;
                };

                // If to the left of it
                if (xOnLeft) {
                    this.x = collisions[0].x - this.w;
                };
            }
        };

        return this;
    }
});
