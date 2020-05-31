<p align="center">
  <a href="" rel="noopener">
 <img src="https://i.imgur.com/3T0TAZW.png" alt="gBunny logo"></a>
</p>

<p align="center"> Simpler and faster git interactions.
    <br>
    <br>
</p>

<div align="center">

<a href="https://www.npmjs.com/package/vue-tasty-burgers" target="_brlak">
  <img alt="npm" src="https://img.shields.io/npm/v/git-bunny">
</a>

![CI](https://github.com/imfaber/git-bunny/workflows/CI/badge.svg)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---



## 📝 Table of Contents

- [📝 Table of Contents](#%f0%9f%93%9d-table-of-contents)
- [🧐 About <a name = "about"></a>](#%f0%9f%a7%90-about)
- [🏁 Getting Started <a name = "getting_started"></a>](#%f0%9f%8f%81-getting-started)
    - [How to install](#how-to-install)
- [🎈 Usage <a name="usage"></a>](#%f0%9f%8e%88-usage)
  - [Use case examples <a name="use-case-examples"></a>](#use-case-examples)
  - [About the REPL](#about-the-repl)
    - [Change the prompt theme in the REPL](#change-the-prompt-theme-in-the-repl)
    - [Prompt explanation](#prompt-explanation)
- [⛏️ Built Using <a name = "built_using"></a>](#%e2%9b%8f%ef%b8%8f-built-using)
- [✍️ Authors <a name = "authors"></a>](#%e2%9c%8d%ef%b8%8f-authors)
- [🎉 Acknowledgements <a name = "acknowledgements"></a>](#%f0%9f%8e%89-acknowledgements)

## 🧐 About <a name = "about"></a>

<p> <strong>gBunny</strong> is a set of commands, along with a <strong>REPL</strong> environment, to enhance the interaction with git in your favourite shell (<code>bash</code>, <code>zsh</code>, <code>powershell</code> etc...).
    <br>
</p>

<p>gBunny creates indexes of Git entities such as paths, branches and tags and offer utilities to make the entity selection simpler and faster.
</p>

<p>Go to <a href="#use-case-examples">Use case examples</a> to see more.
</p>

## 🏁 Getting Started <a name = "getting_started"></a>

<strong>gBunny</strong> requires:
<ul>
  <li><a href="https://nodejs.org/en/" target="_blank">Node.js <code>>= 10.0.0</code></a> (older versions might work too but they are not tested)</li>
  <li><a href="https://git-scm.com/" target="_blank">Git</a></li>
</ul>

#### How to install

```
npm install -g git-bunny
```

## 🎈 Usage <a name="usage"></a>

Once istalled, <strong>gBunny</strong> can be run with the command <code>gbunny</code> or with one of its shorthands if they don't conflict with existing aliases (<code>g</code> and <code>gb</code>).

There are 2 ways to run commands:
1) by starting a new <strong>REPL</strong> session
2) by passing sub-commands to <code>gbunny</code>
   ```
   $ gbunny <command>|<git-command>
   ```

### Use case examples <a name="use-case-examples"></a>

### About the REPL

To start a new session <code>cd</code> to your repository directory and run:
```
$ gbunny
```

Once the REPL is started you can run gBunny and Git sub-commands omitting the <code>git</code> command.

Type <code>h</code> to see the list of available commands.

#### Change the prompt theme in the REPL

At the moment there are only 2 available themes:

- agnoster (requires Powerline font)
  <img src="https://i.imgur.com/FD2FHnC.png">
- arrow
  <img src="https://i.imgur.com/b44u4cC.png">

Themes can be changed with the following command:
```
git config --global "gbunny.repltheme" "THEME_NAME"
```

#### Prompt explanation

```
$ gBunny ❯ my-project ❯ master ❯ ↓1 ↑1 ~0 +2 -0 ❘ ~1 +0 -1 !
```

- <code>gBunny</code> Indicator of a gBunny REPL session
- <code>my-project</code> The repository name
- <code>master</code> The current branch.
  - When green it means there are no changed files
  - Orange means there are changed files
- <code>↓1 ↑1</code> Changes to pull and push
- <code>~0 +2 -0 ❘ ~1 +0 -1 !</code> Changes in the index and in the work tree
  - <code>~</code> Modified files
  - <code>+</code> Added files
  - <code>-</code> Deleted files
  - <code>!</code> Conflicted files


## ⛏️ Built Using <a name = "built_using"></a>

- [TypeScript](https://www.typescriptlang.org/)
- [NodeJs](https://nodejs.org/en/)

## ✍️ Authors <a name = "authors"></a>

- [@imfaber](https://github.com/kylelobo) - Idea & development

## 🎉 Acknowledgements <a name = "acknowledgements"></a>

Inspired by
 - [SCM Breeze](https://github.com/scmbreeze/scm_breeze)
 - [Git-NumberedAdd](https://github.com/itenium-be/Git-NumberedAdd)
