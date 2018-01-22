// @flow
import '../css/styles.scss'

let lastScrollTop = 0
const navbarHeight = document.querySelector('header').clientHeight

window.addEventListener('scroll', function () {
  toggleHeader(window.pageYOffset)
})

const toggleHeader = (scrollTop) => {
  if (Math.abs(lastScrollTop - scrollTop) <= 5) {
    return false
  }

  const wHeight = window.innerHeight
  const dHeight = $(document).height()

  if (scrollTop > lastScrollTop && scrollTop > 50) {
    $('header').removeClass('header--show').addClass('header--hide')
  } else {
    if (scrollTop + wHeight < dHeight) {
      $('header').removeClass('header--hide').addClass('header--show')
    }
  }

  lastScrollTop = scrollTop
}

// sidebar position
$(window).resize(function () {
  editLeftMenu()
})

function editLeftMenu () {
  let pageInnerPosition = document.getElementsByClassName('page__inner')[0].getBoundingClientRect()
  let asideList = document.getElementsByClassName('aside')[0]
  let position = parseInt(pageInnerPosition.x)

  let width = document.documentElement.clientWidth
  let height = document.documentElement.clientHeight

  if (width >= 820) {
    if ((height < 650) && !!asideList) {
      asideList.style.margin = '140px 0 0 0'
      asideList.style.position = 'absolute'
      asideList.style.left = 0;
    } else if ((height < 800) && !!asideList) {
      asideList.style.margin = '0'
      asideList.style.position = 'fixed'
      asideList.style.left = 0;
    } else if ((height >= 900) && !!asideList) {
      asideList.style.margin = '140px 0 0 0'
      asideList.style.position = 'fixed'
      asideList.style.left = 0;
    }
  }

  if ((width < 820 || position <= 0) && !!asideList) {
    asideList.style.margin = '180px 0 0 0'
    asideList.style.position = 'absolute'
    asideList.style.left = position + 'px'
  } else {
    try {
      asideList.style.left = 'calc((100% - 1170px)/2)'
      asideList.style.position = 'fixed'
    } catch (e) {}
  }
}

// sidebar navigation
const hwaAsideItems = document.querySelectorAll('.aside__item')
const hwaItems = document.querySelectorAll('.page__item')

const toggleItemState = (e) => {
  const el = e.currentTarget

  hwaItems.forEach((item) => {
    item.classList.add('page__item--hidden')
  })

  hwaAsideItems.forEach((item) => {
    item.classList.remove('aside__item--active')
  })

  if (!el) {
    return false
  }

  el.classList.add('aside__item--active')

  document.querySelector('#' + el.dataset.pageItemId)
    .classList.remove('page__item--hidden')
}

hwaAsideItems.forEach((item) => {
  item.addEventListener('click', toggleItemState)
})

// header navigation
var location = window.location.pathname.slice(1)

document.onload = function () {
  const headerNavItems = document.querySelectorAll('.header__nav-list-item')

  headerNavItems.forEach(item => {
    let href = item.firstElementChild.getAttribute('href')
    if (href === location) {
      item.classList.add('header__nav-list-item--active')
    } else {
      item.classList.remove('header__nav-list-item--active')
    }
  })
}

// mobile navigation
$(document).ready(function () {
  editLeftMenu()

  $('.mobile-header__nav').click(function () {
    let el = $('.mobile-header__nav')
    if (el.hasClass('toggled')) {
      $('.page__inner, .mobile-header__nav, .header').removeClass('toggled')
      $('body').css('overflow', 'auto')
    }
  })

  $('.header__mobile-menu-icon').click(function (e) {
    let el = $('.page__inner')
    if (!el.hasClass('toggled')) {
      $('.page__inner, .mobile-header__nav, .header').addClass('toggled')
      $('body').css('overflow', 'hidden')
    }

    e.preventDefault()
  })
})
