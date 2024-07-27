# EcoScroll

## Issue
Many youth often struggle with "doom-scrolling", staying on social media websites endlessly going from post to post or video to video, with often not much enjoyment. Personally, this has impacted my life considerably, as this type of behaviour is known to contribute to poor mental health. Additionally, I have struggled to stop myself from abusing these services. I have deleted the apps from my phone and told myself I can only use them on other devices such as my laptop, but even there I sometimes struggle with moderation of these services. It is infeasible to completely cut out all services like YouTube, Twitter, TikTok, Instagram and more from your life, because then you're left out of trends and what your friends are looking at, or unable to view important information, or genuinely enjoy these services in moderation.

## Goal
The goal of this project is to help the user moderate their usage effectively, not completely cut out these services as that is unrealistic. We attempt to do this by adding a lot of "friction" in the way of abusing these services. The harder something is to do, the less likely we are to do it. This extension will be annoying to have and that is the point, but we want it to be designed to be as least frustrating as possible.

## How?
To make these services more difficult to use without eliminating them completely, I plan to make a chrome/firefox extension to allow users to customize their experience to put a stop to social media abuse on their own terms. This means a fully modular program that allows the user to set up their plan in a variety of ways. One way does not work for everyone, and so having this flexibility allows anyone to make something that works for them.

## Potential Features
- Reminders while scrolling 
  - For YouTube shorts / Instagram reels, set a time period or number of content consumed before it will show up 
  - Main thing is, do not interrupt a middle of a content. It should have a default setting to wait until the next thing is picked. 
  - Custom message for when it reminds you, allows for a list or different kinds of action 
- YouTube
  - Max number of videos, or time per day
  - Allow for setting to allow users to finish a video if it within a time range 
  - This is meant to target rabbit hole-ing, set up a system such that users can very easily pickup 
  - Block non-informational genres from being watched immediately, have users assign videos to a queue to view them after a configured time period has elapsed. 
  - Block YouTube shorts 
  - Timer on all websites to track how long you've been on 
  - Stat tracking 
  - Bypassing restrictions if opening link from external place, such as through a messenger. 
    - It would suck if you got sent a funny video on Discord and couldn't watch it 
  - Account Syncing 
    - Allow multi-device setup, stats are tracked and synced between all devices so that you cannot simply move to the next device. 
  - Configuration locking 
  - You must wait at least xx time before your configuration change will go through 
  - Non-local configuration storage 
    - Fiends will bypass it, however this is too extreme
  - Anti-removal, the settings can just be bypassed by removing the plugin. We purposely want it invasive however so users can't do this
