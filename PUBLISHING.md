# Publishing a new version of this package

1. run `yarn publish`. This will ask you the new version, login into npm, build
   the package, commit and tag before pushing to npm.
   If you want to stop at any moment, you can ctrl-c, and depending on the moment,
   you'll need to rollback manually.
2. On github, you need to edit the branch protection rules, and uncheck the
   option "Do not allow bypassing the above settings".
3. Then you can push to github with the tags: `git push upstream HEAD --tags`. This
   is the only case you're allowed to push directly to github.
4. Check the option "Do not allow bypassing the above settings" again.
5. On github, go to the tags page, then create a new release from the new tag
   (this is an option in the "..." menu at the right).
6. Click "Generate releases notes" then follow the format of previous releases.



