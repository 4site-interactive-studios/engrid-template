The ENGrid repo is now a "Starter Theme" (https://github.com/4site-interactive-studios/engrid). Which we (4Site) duplicate for each client theme we want to build, but you most likely can just Fork it. The only reason we are not forking it is that it turns out you can only fork a repo once per Github account and we need to do it many times over.

Our ENGrid "Start Theme" includes semantically versioned NPM dependencies for the upstream ENGrid code (e.g. SASS and Typescript) which now lives at (https://github.com/4site-interactive-studios/engrid-scripts)
Here's an example of a cloned ENGrid "Starter Theme" then being customized with the client SASS (https://github.com/4site-interactive-studios/engrid-aiusa).

--

If you're not interested in forking the repo, here are instructions for cloning it into your own repository.

From your command line run the following to create a clean copy on your computer of the main ENGrid repository. And wherever you see XYZ replace that with the desired name of your project.

You need [Node.js](https://nodejs.org/en/download/) to use `npx`.

`npx degit https://github.com/4site-interactive-studios/engrid engrid-XYZ`

Now create a new repository on Github by the same name (e.g. engrid-XYZ)

In VSCode open your local copy of the repository you just created (engrid-XYZ). Then in VSCode's Terminal run:

`git init`

`git add .`

`git commit -m "first commit"`

`git branch -M main`

The next command you need to run will the URL for your Github repository you just created. ABC is used below as a stand in for the account under which the repository was created (e.g `github.com:/your-account-name/engrid-XYZ.git`).

`git remote add origin gig@github.com:ABC/engrid-XYZ.git`

`git push -u origin main`

You have now duplicated a clean copy of ENGrid into your own Github Repository!
