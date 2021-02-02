From your command line run the following to create a clean copy on your computer of the main ENGrid repo.
Wherever you see XYZ replace that with the desired name of your project.

npx degit https://github.com/4site-interactive-studios/engrid engrid-XYZ

Create a new Repo on Github by the same name (e.g. engrid-XYZ)

Open in VSCode the local copy (engrid-XYZ) you just created

In VSCode's Terminal run
git init
git add .
git commit -m "first commit"
git branch -M main

The next command will use the URL for your Github repository. ABC is a stand in for the account under which the repository was created.
git remote add origin gig@github.com:ABC/engrid-XYZ.git
git push -u origin main

You have now duplicated a clean copy of ENGrid into your own Github Repository
