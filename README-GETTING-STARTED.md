The ENGrid repo is now a "Starter Theme" (https://github.com/4site-interactive-studios/engrid). Which we (4Site) duplicate for each client theme we want to build, but you most likely can just Fork it. The only reason we are not forking it is that it turns out you can only fork a repo once per Github account and we need to do it many times over.

Our ENGrid "Start Theme" includes semantically versioned NPM dependencies for the upstream ENGrid code (e.g. SASS and Typescript) which now lives at (https://github.com/4site-interactive-studios/engrid-scripts)
Here's an example of a cloned ENGrid "Starter Theme" then being customized with the client SASS (https://github.com/4site-interactive-studios/engrid-aiusa).

--

If you can Fork the repo you should, otherwise you'll need to duplicate it into a new repo. Intructions for the duplication process are below.

**Prep**

You need [Node.js](https://nodejs.org/en/download/) to use `npx`.

**Notes**

XYZ = Your abreviated organizational name (e.g. peta, nwf, ewg)

**Instructions**

Got to GitHub and create a new repository with the name (e.g. engrid-XYZ). Replace XYZ with your abreviated organizational name

From your command line (Terminal or VSCode) **navigate to an empty folder** (this includes no hidden files). Run the following code to create a clean copy of the ENGrid repo in that folder. Then stage everything for committing and rename the default branch to "main".

`npx degit https://github.com/4site-interactive-studios/engrid#main engrid-XYZ`

`git init`

`git add .`

`git commit -m "first commit"`

`git branch -M main`

For the next command you need to the URL for your Github repository created. ABC is used below as a stand in for the GitHub account name under which the repository was created (e.g `github.com:/your-account-name/engrid-XYZ.git`).

`git remote add origin git@github.com:ABC/engrid-XYZ.git`

`git push -u origin main`

You have now duplicated a clean copy of ENGrid into your own Github Repository!
