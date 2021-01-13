export const hasInterpolation = text => /\{?\{\{(.+?)\}\}\}?/g.test(text)

export function domify(DOMString) {
    const html = document.implementation.createHTMLDocument()
    html.body.innerHTML = DOMString
    return html
}

export function walk(el, action, done) {
    
    const nodes = el.childNodes && [].slice.call(el.childNodes)

    done = done || function () {}
    action = action || function () {}

    function next(skip) {
        if (skip || nodes.length === 0) return done()
        walk(nodes.shift(), action, next)
    }

    action(el, next)
}

const tagRE = /\{\{((?:.|\n)+?)\}\}/g;
export function parseText(text) {
    if (!tagRE.test(text)) return JSON.stringify(text)

    const tokens = []
    let lastIndex = tagRE.lastIndex = 0
    let index, matched

    while (matched = tagRE.exec(text)) {
        index = matched.index
        if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(matched[1].trim())
        lastIndex = index + matched[0].length
    }

    if (lastIndex < text.length) tokens.push(JSON.stringify(text.slice(lastIndex)))

    return tokens.join('+')
}


const dependencyRE = /"[^"]*"|'[^']*'|\.\w*[a-zA-Z$_]\w*|\w*[a-zA-Z$_]\w*:|(\w*[a-zA-Z$_]\w*)/g
const globals = [
    'true', 'false', 'undefined', 'null', 'NaN', 'isNaN', 'typeof', 'in',
    'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'unescape',
    'escape', 'eval', 'isFinite', 'Number', 'String', 'parseFloat', 'parseInt',
]

// extractDependencies(`typeof String(name) === 'string'  && 'Hello ' + world + '! ' + hello.split('').join('') + '.'`);
// => ["name", "world", "hello"]
function extractDependencies(expression) {
    const dependencies = [];

    expression.replace(dependencyRE, (match, dependency) => {
        const isDefined = dependency => dependency !== undefined;
        const hasDependency = (dependencies, dependency) => dependencies.includes(dependency);
        const hasGlobal = (globals, dependency) => globals.includes(dependency);

        if (isDefined(dependency) && !hasDependency(dependencies, dependency) && !hasGlobal(globals, dependency)) {
            dependencies.push(dependency);
        }
    });

    return dependencies;
}


// 标签解析成 JavaScript 表达式 `<h1>Hey , {{ value }}</h1>` => `'Hey , ' + value`
// 提取其中的依赖变量并取得所在 `data` 中的对应值
// 利用 `new Function()` 来创建一个匿名函数来返回这个表达式
export function generate(expression) {
    const dependencies = extractDependencies(expression);
    const dependenciesCode = dependencies.reduce((prev, current) => {
        prev += `var ${current} = data["${current}"]; `
        return prev;
    }, '')
    return new Function(`data`, `${dependenciesCode}return ${expression};`)
}


export function firstToUpper(str) {
    return str.trim().toLowerCase().replace(str[0], str[0].toUpperCase());
}

const each = {
    before() {
        this.placeholder = document.createComment(`:each`)
        this.node.parentNode && this.node.parentNode.replaceChild(this.placeholder, this.node)
    },
    display(data) {
        if (data && !Array.isArray(data)) return

        const fragment = document.createDocumentFragment()

        data.map((item, index) => {
            const compiled = Compile(this.node.cloneNode(true), { item:item, index:index })
            fragment.appendChild(compiled.view)
        })
        
        this.placeholder.parentNode.replaceChild(fragment, this.placeholder)
    }
}

const forin = {
    before() {
        this.placeholder = document.createComment(`:forin`)
        this.node.parentNode && this.node.parentNode.replaceChild(this.placeholder, this.node)

        this.itemName = `item`
        this.indexName = `index`
        this.dataName = this.expression

        if (this.expression.indexOf(' in ') != -1) {
            const bracketRE = /\(((?:.|\n)+?)\)/g;
            const [item, data] = this.expression.split(' in ')
            const matched = bracketRE.exec(item)

            if (matched) {
                const [item, index] = matched[1].split(',')
                index ? this.indexName = index.trim() : ''
                this.itemName = item.trim()
            } else {
                this.itemName = item.trim()
            }

            this.dataName = data.trim()
        }

        this.expression = this.dataName
    },
    display(data) {
        if (data && !Array.isArray(data)) return

        const fragment = document.createDocumentFragment()

        data.map((item, index) => {
            const compiled = Compile(this.node.cloneNode(true), {
                [this.itemName]: item,
                [this.indexName]: index,
            })
            fragment.appendChild(compiled.view)
        })
        
        this.placeholder.parentNode.replaceChild(fragment, this.placeholder)
    }
}

export const config = {
    show: {
        before(value) {
            console.log(value)
        },
        display(value) {
            this.node.style.display = value ? `block` : `none`
        },
    },
    text: {
        before(value) {
            this.isUpdate = true
            if (this.oldValue == value) {
                this.isUpdate = false
            }
        },
        display(value) {
            if (!this.isUpdate) {
                return
            }
            this.oldValue = value
            this.node.textContent = value
        },
    },
    model: {
        before(value) {
            this.isUpdate = true
            if (this.oldValue == value) {
                this.isUpdate = false
            }
        },
        display(value) {
            if (!this.isUpdate) {
                return
            }

            this.node.value = typeof value == 'undefined' ? '' : value;
            this.node.addEventListener('input', (e) => {

                var newValue = e.target.value;
                if (value === newValue) {
                    return;
                }

                this.oldValue = e.target.value
                this.compile.data[this.expression] = e.target.value;
                
            });

        },
    },
    attribute : {
        before(value) {},
        display(value) {
            this.node.setAttribute(this.attrName, value)
        },
    },
    each:each,
    forin:forin
}