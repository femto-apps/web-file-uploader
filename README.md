<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Chat][chat-shield]][chat-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/femto-apps/web-file-uploader">
    <img src="public/images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Web File Uploader</h3>

  <p align="center">
    Share files, images and other content.
    <br />
    <a href="https://github.com/femto-apps/web-file-uploader"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://v2.femto.pw">View Demo</a>
    ·
    <a href="https://github.com/femto-apps/web-file-uploader/issues">Report Bug</a>
    ·
    <a href="https://github.com/femto-apps/web-file-uploader/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

[![Web File Uploader Screenshot][product-screenshot]](https://v2.femto.pw)

Sharing files, images and other forms of media between users should be easy and fast.  Unfortunately many existing sharing solutions will only accept certain formats (e.g. sharing images) or have security issues surrounding execution of untrusted code.

Thus, the aptly named 'web file uploader' has been written, it's main features include:

- Fast and minimal, pages are <20kb in size.
- Intelligent handling of files based on type, can generate icons and previews.
- Handles images, text, URLs and other forms of media.

### Built With

* [Node](https://nodejs.org)
* [Redis](https://redis.io/)
* [MongoDB](https://www.mongodb.com/)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* [node](https://nodejs.org/en/download/) (tested on v12+)
* npm
```sh
npm install npm@latest -g
```
* minio
```sh
# either from https://min.io/ or with Docker:
docker volume create --name=miniodata
docker run -p 9000:9000 -e MINIO_ACCESS_KEY=CHANGE_ME_ACCESS_KEY -e MINIO_SECRET_KEY=CHANGE_ME_SECRET_KEY --name minio -v miniodata:/data -d minio/minio server /data
```
* mongo
```sh
# either from https://www.mongodb.com/ or with Docker:
docker volume create --name=mongodata
docker run -p 27017:27017 --name mongo -v mongodata:/data/db -d mongo
```
* redis
```sh
# either from https://redis.io/ or with Docker:
docker volume create --name=redisdata
docker run -p 6379:6379 --name redis -v redisdata:/data -d redis redis-server --appendonly yes
```
* [web-authentication-provider](https://github.com/femto-apps/web-authentication-provider)
* [web-authentication-token-service](https://github.com/femto-apps/web-authentication-token-service)

If virus scanning is enabled you need to install:

* clamav
```sh
# the port is set to 9001 because 9000 is used by minio by default
docker run -p 9001:9000 --name clamav -d niilo/clamav-rest
# this takes a while to start up, monitor progress with `docker logs clamav`
```

### Installation

1. Clone the repo
```sh
git clone https://github.com/femto-apps/web-file-uploader
```
2. Install NPM packages
```sh
npm install
```
3. Copy `config.default.hjson` to `config.hjson`
```sh
cp config.default.hjson config.hjson
```
4. Update the configuration to your liking, specifically you must change `minio.accessKey`, `minio.secretKey`, `session.secret` and `authenticationProvider.consumerId`

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/femto-apps/web-file-uploader/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Alexander Craggs - uploader@femto.host
Dimi3 - https://github.com/dimi3

Project Link: [https://github.com/femto-apps/web-file-uploader](https://github.com/femto-apps/web-file-uploader)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Img Shields](https://shields.io)
* [Choose an Open Source License](https://choosealicense.com)





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/femto-apps/web-file-uploader.svg?style=flat-square
[contributors-url]: https://github.com/femto-apps/web-file-uploader/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/femto-apps/web-file-uploader.svg?style=flat-square
[forks-url]: https://github.com/femto-apps/web-file-uploader/network/members
[chat-shield]: https://img.shields.io/discord/493418312714289158?style=flat-square
[chat-url]: https://femto.pw/discord
[stars-shield]: https://img.shields.io/github/stars/femto-apps/web-file-uploader.svg?style=flat-square
[stars-url]: https://github.com/femto-apps/web-file-uploader/stargazers
[issues-shield]: https://img.shields.io/github/issues/femto-apps/web-file-uploader.svg?style=flat-square
[issues-url]: https://github.com/femto-apps/web-file-uploader/issues
[license-shield]: https://img.shields.io/github/license/femto-apps/web-file-uploader.svg?style=flat-square
[license-url]: https://github.com/femto-apps/web-file-uploader/blob/master/LICENSE.txt
[product-screenshot]: public/images/new_screenshot.png
