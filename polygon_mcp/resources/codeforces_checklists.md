# CF checklists

> To complete a checklist, always **open** it and go point by point, making sure each step is completed before you proceed to the next one. Do not try to complete it by memory.

## Before testing checklist

- [ ] English statements are ready
  - [ ] No company names, products, or trademarks are mentioned
- [ ] At least 2 examples/test cases
- [ ] At least 2 examples/test cases have notes
- [ ] There is a bruteforce solution in each problem
- [ ] There is a stress-test with the bruteforce solution
- [ ] Validators are correct
- [ ] Checkers are correct, standard or readAns

## Scheduling checklist

- [ ] Testing is complete with testers from both divisions
- [ ] Each problem has a solution from a tester and/or coordinator
- [ ] For every incomplete point from “2 days before the contest” there is an assigned polygon issue
- [ ] Polygon contest is named `Codeforces Round <id> <(Div. 2)> [authors | coordinator]` and shared to `@codeforces-rounds`
- [ ] Editorials in Polygon are started
- [ ] The contest ids are linked to the Discord bot

## 2 days before the contest

- [ ] The latest packages are built with verification
- [ ] There are no reasonable warnings (in Polygon and from the bot)
- [ ] No statement edits are expected
  - [ ] Hacking format for interactive problems described?
  - [ ] Pictures do not exceed 50 kB
- [ ] Translation is requested
- [ ] All problems have multitests
- [ ] All small tests are covered in pretests
- [ ] Pretests are created
  - [ ] Is pretests number within limits?
- [ ] Validators are correct
  - [ ] Does any problem need hacking disabled?
- [ ] Checkers are correct: standard or readAns
  - [ ] In readAns function, check the return type
  - [ ] For readAns checker, there is a checker test with the participants' answer better than the jury's.
- [ ] Each problem has a bruteforce solution
- [ ] Each problem has a full solution not written by the author
- [ ] Testers’ solutions are added
- [ ] There is a stress-test with the bruteforce solution
- [ ] There are 2 stress-tests with testers’ solutions: one with small and one with large constraints
- [ ] In div2A TL 1s, in div2B TL <= 1.5s, solutions with many flushes and Python pass
- [ ] Editorials are done or about to be finished
- [ ] Announcement is published
  - [ ] On the contests page, the correct authors and duration are set
