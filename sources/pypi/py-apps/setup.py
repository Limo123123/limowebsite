from setuptools import setup, find_packages

setup(
    name='py-apps',  # Name of your package
    version='0.4',
    packages=find_packages(),
    install_requires=[],  # Add any dependencies here
    entry_points={
        "console_scripts": [
            "py-apps = py_apps.py_apps:main",
            "py-apps-gui = py_apps.py_apps_gui:main",
        ],
    },
    author='Florian Töns',
    author_email='tfl-team@gmx.net',
    description='A Clone of Pi-Apps but for Python',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
    url='https:////limo-games',  # GitHub link if applicable
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: GNU General Public License V3',
        'Operating System :: OS Independent',
    ],
)
