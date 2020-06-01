<p align="center">
  <a href="" rel="noopener">
 <img src="https://i.imgur.com/3T0TAZW.png" alt="gBunny logo"></a>
</p>

<p align="center"> Simpler and faster git interactions.
    <br>
    <br>
</p>

<div align="center">

![npm](https://img.shields.io/npm/v/gbunny)
![CI](https://github.com/imfaber/git-bunny/workflows/CI/badge.svg)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

<br>

## 📝 Table of Contents <a name="table-of-contents"></a>

- [📝 Table of Contents](#table-of-contents)
- [🧐 About](#about)
- [🏁 Getting Started](#getting-started)
    - [How to install](#how-to-install)
- [🎈 Usage](#usage)
  - [Use case examples](#use-case-examples)
  - [About the REPL](#about-the-repl)
    - [Change the prompt theme in the REPL](#change-the-prompt-theme-in-the-repl)
    - [Prompt explanation](#prompt-explanation)
- [⛏️ Built Using](#built-using)
- [✍️ Authors](#authors)
- [🎉 Acknowledgements](#acknowledgements)

<br>

## 🧐 About <a name = "about"></a>

<p> <strong>gBunny</strong> is a set of commands, along with a <strong>REPL</strong> environment, to enhance the interaction with git in your favourite shell (<code>bash</code>, <code>zsh</code>, <code>powershell</code> etc...).
    <br>
</p>

<p>gBunny creates indexes of Git entities such as paths, branches and tags and offer utilities to make the entity selection simpler and faster.
</p>

<p>Go to <a href="#use-case-examples">Use case examples</a> to see more.
</p>
<br>

## 🏁 Getting Started <a name = "getting-started"></a>

<strong>gBunny</strong> requires:
<ul>
  <li><a href="https://nodejs.org/en/" target="_blank">Node.js <code>>= 10.0.0</code></a> (older versions might work too but they are not tested)</li>
  <li><a href="https://git-scm.com/" target="_blank">Git</a></li>
</ul>

#### How to install

```
npm install -g git-bunny
```
<br>

## 🎈 Usage <a name="usage"></a>

Once istalled, <strong>gBunny</strong> can be run with the command <code>gbunny</code> or with one of its shorthands if they don't conflict with existing aliases (<code>g</code> and <code>gb</code>).

There are 2 ways to run commands:
1) by starting a new <strong>REPL</strong> session
2) by passing sub-commands to <code>gbunny</code>
   ```
   $ gbunny <command>|<git-command>
   ```
<br>

### Use case examples <a name="use-case-examples"></a>

<br>

### About the REPL

To start a new session <code>cd</code> to your repository directory and run:
```
$ gbunny
```

Once the REPL is started you can run gBunny and Git sub-commands omitting the <code>git</code> command.

Type <code>h</code> to see the list of available commands.


#### Change the prompt theme in the REPL

At the moment there are only 2 available themes:

- agnoster (requires Powerline font)<br>
  <img src="https://i.imgur.com/FD2FHnC.png" height=35>
- arrow<br>
  <img src="https://i.imgur.com/b44u4cC.png" height=35>

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
<br>

## ⛏️ Built Using <a name = "built-using"></a>

- [TypeScript](https://www.typescriptlang.org/)
- [NodeJs](https://nodejs.org/en/)
<br>

## ✍️ Authors <a name = "authors"></a>

- [@imfaber](https://github.com/kylelobo) - Idea & development
<br>

## 🎉 Acknowledgements <a name = "acknowledgements"></a>

Inspired by
 - [SCM Breeze](https://github.com/scmbreeze/scm_breeze)
 - [Git-NumberedAdd](https://github.com/itenium-be/Git-NumberedAdd)
<br>
