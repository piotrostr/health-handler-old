import time
import requests
import pickle
import os

from django import setup as setup
os.environ['DJANGO_SETTINGS_MODULE'] = 'products_api.settings'
setup()

from products.models import Product

from decimal import Decimal
from selenium import webdriver
from selenium.common import exceptions
from webdriver_manager.chrome import ChromeDriverManager


class Scraper:

    base_link = "https://www.sainsburys.co.uk/shop/gb/groceries"
    model = Product
    timeout = 15
    click_exceptions = (
        exceptions.ElementNotInteractableException,
        exceptions.ElementClickInterceptedException
    )

    def __init__(self):
        self.driver = webdriver.Chrome(ChromeDriverManager().install())
        self.links = []
        self.categories = self._category_generator()

    def go_on_sainsburys(self):
        self.driver.get(self.base_link)
        cookies_accepted = False
        timeout = time.time() + self.timeout
        while not cookies_accepted and time.time() < timeout:
            try:
                xpath = '//*[@id="onetrust-accept-btn-handler"]'
                self.driver.find_element_by_xpath(xpath).click()
                cookies_accepted = True
            except (self.click_exceptions, exceptions.NoSuchElementException):
                time.sleep(1)
                continue

    def go_to_next_page(self) -> bool:
        """
        :returns on_next_page: True on success, False if no more pages
        """
        on_next_page = False
        timeout = time.time() + self.timeout
        while not on_next_page and time.time() < timeout:
            try:
                next_btn = driver.find_element_by_class_name('next')
                next_btn.click()
                clicked = True
                on_next_page = True
            except self.click_exceptions:
                time.sleep(1)
                continue
            except exceptions.NoSuchElementException:
                return False
            if clicked:
                try:
                    next_btn.click()
                except self.click_exceptions:
                    on_next_page = True
        return on_next_page

    def insert_products_from_page(self):
        gv = self.driver.find_element_by_class_name('productLister gridView')
        # todo
        self.model(name=name, store=store, amount=amount,
                   price=price, unit=unit).save()

    def get_product_links(self) -> None:
        """
        Retrieves and appends all the links from the current page
        page that the driver is on to the links list.
        """
        for i in self.driver.find_elements_by_tag_name("a"):
            link = i.get_attribute("href")
            if link:
                if 'product' in link and 'details' in link:
                    self.links.append(i.get_attribute("href"))

    def scrape(self):
        self.go_on_sainsburys()
        while True:
            next_category = next(self.categories)
            if next_category:
                self.driver.get(self.base_link + next_category)
            else:
                break
            self.insert_products_from_page()
            while self.go_to_next_page():
                self.insert_products_from_page()

    @staticmethod
    def _category_generator():
        for category in ['/fruit-veg', '/meat-fish', '/dairy-eggs-and-chilled',
                         '/bakery', 'food-cupboard', '/frozen', False]:
            yield category


if __name__ == '__main__':
    Scraper().scrape()
