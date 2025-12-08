from setuptools import setup, find_packages

setup(
    name="limo-games",
    version="1.0.3",
    packages=find_packages(),
    install_requires=[],
    entry_points={
        "console_scripts": [
            "limo-games = limo_games.server:main",
            "limo-games-ui = limo_games.serverui:main",
        ],
    },
    author="Florian Töns",
    author_email="tfl.team@gmx.de",
    description="Limo-Games is a Webserver, with an fully Website",
    long_description="There is none Longer",
    long_description_content_type="text/markdown",
    url="https:////limo-games/",  # Falls du es auf GitHub hostest
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: GNU 3 License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.7",
)
