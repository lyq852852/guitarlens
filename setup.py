from setuptools import setup, find_packages

setup(
    name='guitarlens',
    version='0.1.0',
    description='AI-powered guitar tab transcription software',
    author='Mac',
    author_email='',
    url='https://github.com/yourusername/guitarlens',
    packages=find_packages(),
    python_requires='>=3.8',
    install_requires=[
        'demucs==4.0.1',
        'basic-pitch==0.2.1',
        'librosa==0.10.0',
        'numpy==1.24.3',
        'scipy==1.11.1',
        'soundfile==0.12.1',
        'madmom==0.16.1',
        'pydub==0.25.1',
        'music21==9.1.0',
    ],
    entry_points={
        'console_scripts': [
            'guitarlens=engine:main',
        ],
    },
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
    ],
)
